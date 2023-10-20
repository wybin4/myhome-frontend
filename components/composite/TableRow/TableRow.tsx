/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfoWindow, Paragraph, Tag } from "@/components";
import { ITableRowArr, ITableRowItem, TableAttachmentProps, TableRowItemDesktopProps, TableRowItemMobileProps, TableRowProps, TableTagProps, TableTextProps } from "./TableRow.props";
import styles from "./TableRow.module.css";
import cn from 'classnames';
import React, { useEffect, useState } from "react";
import { Action } from "./Action/Action";

function combineArrays(...arrays: (ITableRowItem[] | undefined)[]): ITableRowItem[][] {
    const maxLength = Math.max(...arrays.map(arr => arr?.length || 0));

    const newArrays: ITableRowItem[][] = [];
    for (let i = 0; i < maxLength; i++) {
        const newArray: ITableRowItem[] = [];
        for (const arr of arrays) {
            newArray.push(arr?.[i] || { type: "none", item: undefined, title: "" });
        }
        newArrays.push(newArray);
    }

    return newArrays;
}

const getRowItems = (items: ITableRowArr[]): (ITableRowItem[] | undefined)[] => {
    return items.map(item => {
        return item.items?.map(i => {
            return {
                title: item.title,
                item: i,
                type: item.type,
                icons: item.icons
            };
        });
    });
};

export const TableRow = ({
    startIcon, actions, items, ids,
    keyElements = { first: [1], isSecondNoNeedTitle: false, second: 2 },
    className, ...props
}: TableRowProps): JSX.Element => {
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [infoWindowData, setInfoWindowData] = useState(
        {
            title: "",
            description: "",
            text: "",
            tags: [""],
        }
    );

    if (actions) {
        actions.actions.map(action => {
            if (action.type === "view") {
                action.onClick = () => {
                    setIsInfoWindowOpen(!isInfoWindowOpen);
                };
                action.setSelectedId = setSelectedId;
                return action;
            }
        });
    }

    useEffect(() => {
        const index = ids.findIndex(id => id === selectedId);
        const item = combineArrays(...getRowItems(items))[index];

        if (item) {
            const [title, tags0, tags1, description, text, ...restTags] = item;
            setInfoWindowData({
                title: String(title?.item) || "",
                description: String(description?.item) || "",
                text: String(text?.item) || "",
                tags: [tags0, tags1, ...restTags].filter(Boolean).map(item => String(item.item)),
            });
        }
    }, [selectedId]);

    return (
        <>
            <InfoWindow
                {...infoWindowData}
                isOpen={isInfoWindowOpen}
                setIsOpen={setIsInfoWindowOpen} />
            <TableRowDesktop
                startIcon={startIcon} actions={actions} items={items} ids={ids}
                className={cn(className, "md:hidden sm:hidden")}
                {...props} />
            <TableRowMobile
                startIcon={startIcon} actions={actions} items={items} ids={ids}
                keyElements={keyElements}
                className={cn(className, "md:flex sm:flex 3xl:hidden 2xl:hidden xl:hidden lg:hidden")}
                {...props} />
        </>
    );
};

const TableRowDesktop = ({
    startIcon, actions, ids, items,
    className, ...props
}: TableRowProps) => {
    const countOfRows = ids ? ids.length : items[0].items?.length;

    const getActions = () => {
        if (countOfRows && actions) {
            const elementsToRender = [];
            for (let i = 0; i < countOfRows; i++) {
                const id = ids[i];
                const thisActions = actions;
                if (thisActions) {
                    thisActions.actions.map(action => {
                        return action.id = id;
                    });
                }
                elementsToRender.push(<Action key={i} {...thisActions} />);
            }
            return elementsToRender;
        }
        return null;
    };

    const getStartIcons = () => {
        if (countOfRows && startIcon) {
            const elementsToRender = [];
            for (let i = 0; i < countOfRows; i++) {
                elementsToRender.push(
                    React.cloneElement(startIcon, { key: i })
                );
            }
            return elementsToRender;
        }
        return null;
    };

    return (
        <>
            <div className={cn("flex gap-12", styles.rowDesktop, className)} {...props}>
                {startIcon && <div className={cn("flex flex-col gap-4", styles.iconWrapper)}>
                    <Paragraph size="s" className="font-medium">⠀</Paragraph>
                    {getStartIcons()}
                </div>}
                {items && items.map((item, key) =>
                    <TableRowItemDesktop
                        key={key}
                        {...item} />)
                }
                {actions?.actions && actions.actions.length !== 0 &&
                    <div className="flex flex-col gap-4">
                        <Paragraph size="s" className="font-medium">Действия</Paragraph>
                        {getActions()}
                    </div>
                }
            </div>
        </>
    );
};

const TableRowItemDesktop = ({ title, type, items, ...props }: TableRowItemDesktopProps) => {
    return (
        <div className="flex flex-col gap-4" {...props}>
            <Paragraph size="s" className="font-medium">{title}</Paragraph>
            {items && items.map((item, key) => {
                switch (type) {
                    case "tag":
                        return (
                            <TableTag text={item} key={key} />
                        );
                    case "icon":
                        return (
                            <TableTag text={item} key={key} appearance="primary" />
                        );
                    case "text":
                        return (
                            <TableText text={item} key={key} />
                        );
                    case "attachment":
                        return (
                            <TableAttachment text={item} key={key} />
                        );
                    default:
                        return <></>;
                }
            })}
        </div>
    );
};

const TableRowMobile = ({
    startIcon, actions, ids, items,
    className,
    keyElements = {
        first: [1], second: 2, isSecondNoNeedTitle: false
    },
    ...props }: TableRowProps) => {
    const rowItems = getRowItems(items);
    const newRowItems = combineArrays(...rowItems);

    return (
        <>
            <div className={cn(className, styles.rowsMobileWrapper)} {...props}>
                {newRowItems && newRowItems.map((i, key) =>
                    <TableRowItemMobile
                        key={key}
                        keyElements={keyElements}
                        startIcon={startIcon}
                        actions={actions}
                        elId={ids ? ids[key] : 0}
                        items={i}
                    />)
                }
            </div>
        </>
    );
};

const TableRowItemMobile = ({ items, startIcon, actions, elId, keyElements, ...props }: TableRowItemMobileProps) => {
    const getElement = (item: ITableRowItem, key?: number): JSX.Element => {
        switch (item.type) {
            case "tag":
                return (
                    <TableTag text={item.item} key={key} />
                );
            case "text":
                return (
                    <TableText text={item.item} key={key} />
                );
            case "attachment":
                return (
                    <TableAttachment text={item.item} key={key} />
                );
            default:
                return <></>;
        }
    };

    const firstItem = items ? items.filter((item, index) =>
        keyElements.first.includes(index + 1)) : undefined;
    const iconsArr = items ? items.find(item => item.type === "icon") : undefined;
    const icon = iconsArr?.icons?.find(i => i.key === iconsArr.item);
    const secondItem = items ? items[keyElements.second - 1] : undefined;
    const itemsFiltered = items ? items.filter((item, index) =>
        !keyElements.first.includes(index + 1) &&
        index !== (keyElements.second - 1) && item.type !== "icon") : undefined;

    return (
        <div className={cn(styles.itemMobile)} {...props}>
            <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                    {icon && <div className={styles.icon}>{icon.icon}</div>}
                    {startIcon && <div className={styles.iconWrapper}>{startIcon}</div>}
                    <div>
                        {secondItem &&
                            <div className={cn("flex gap-x-1 items-center", styles.secondItem)}>
                                {!keyElements.isSecondNoNeedTitle && secondItem.title}
                                {getElement(secondItem)}
                            </div>
                        }
                        {firstItem && (
                            <span className={cn(styles.firstItem, "flex gap-1")}>
                                {firstItem.map((obj, index) => (
                                    <React.Fragment key={index}>
                                        {getElement(obj, index)}
                                    </React.Fragment>
                                ))}
                            </span>
                        )}
                    </div>
                </div>
                {actions &&
                    <Action
                        isMobile={true}
                        actions={actions.actions.map(action => ({ ...action, id: elId }))}
                    />
                }
            </div>
            {(itemsFiltered && itemsFiltered.length !== 0) &&
                <>
                    <hr className={styles.hr}></hr>
                    <div className={styles.bottomItemsWrap}>
                        {itemsFiltered.map((item, index) => {
                            return (
                                <div key={index}>
                                    <span className={styles.mobileTitle}>{item.title}</span>
                                    {getElement(item, index)}
                                </div>
                            );
                        })}
                    </div>
                </>}
        </div>
    );
};

const TableText = ({ text, ...props }: TableTextProps) => {
    return (
        <div className={styles.mobileTextWrapper} {...props}>
            {text ? (
                <div className={cn(styles.rowContent, styles.mobileText)}>{text}</div>
            ) : (
                <div className={styles.rowContent}>—</div>
            )}
        </div>
    );
};

const TableAttachment = ({ text, ...props }: TableAttachmentProps) => {
    return (
        <div {...props}>
            {text ? (
                <div className={cn(styles.underline, styles.rowContent)}>
                    {text}
                </div>
            ) : (
                <div className={styles.rowContent}>—</div>
            )}
        </div>
    );
};

const TableTag = ({ text, appearance = "primary-border", ...props }: TableTagProps) => {
    return (
        <div {...props} className={styles.rowContent}>
            <Tag className={styles.rowTag} appearance={appearance} size="s">
                {text}
            </Tag>
        </div>
    );
};