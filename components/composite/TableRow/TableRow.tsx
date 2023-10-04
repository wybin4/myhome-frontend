/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paragraph, Tag } from "@/components";
import { ActionProps, ITableRowItem, TableAttachmentProps, TableRowItemDesktopProps, TableRowItemMobileProps, TableRowProps, TableTagProps, TableTextProps } from "./TableRow.props";
import styles from "./TableRow.module.css";
import cn from 'classnames';
import DownloadIcon from "./download.svg";
import CommectIcon from "./comment.svg";
import DeleteIcon from "./delete.svg";
import EditIcon from "./edit.svg";
import React from "react";

export const TableRow = ({
    startIcon, actions, items,
    keyElements = { first: [1], second: 2 },
    className, ...props
}: TableRowProps): JSX.Element => {

    return (
        <>
            <TableRowDesktop startIcon={startIcon} actions={actions} items={items}
                className={cn(className, "md:hidden sm:hidden")} {...props} />
            <TableRowMobile startIcon={startIcon} actions={actions} items={items} keyElements={keyElements}
                className={cn(className, "md:flex sm:flex 3xl:hidden 2xl:hidden xl:hidden lg:hidden")} {...props} />
        </>
    );
};

const TableRowDesktop = ({ startIcon, actions, items, className, ...props }: TableRowProps) => {
    const countOfRows = items[0].items?.length;

    const getActions = () => {
        if (countOfRows && actions) {
            const elementsToRender = [];
            for (let i = 0; i < countOfRows; i++) {
                elementsToRender.push(<Action key={i} actions={actions} />);
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
                {actions.length !== 0 && <div className="flex flex-col gap-4">
                    <Paragraph size="s" className="font-medium">Действия</Paragraph>
                    {getActions()}
                </div>}
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

const TableRowMobile = ({ startIcon, actions, items, className, keyElements = { first: [1], second: 2 }, ...props }: TableRowProps) => {
    const rowItems: (ITableRowItem[] | undefined)[] = items.map(item => {
        return item.items?.map(i => {
            return {
                title: item.title,
                item: i,
                type: item.type
            };
        });
    });

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
                        items={i}
                    />)
                }
            </div>
        </>
    );
};

const TableRowItemMobile = ({ items, startIcon, actions, keyElements, ...props }: TableRowItemMobileProps) => {
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
    const secondItem = items ? items[keyElements.second - 1] : undefined;
    const itemsFiltered = items ? items.filter((item, index) =>
        !keyElements.first.includes(index + 1) &&
        index !== (keyElements.second - 1)) : undefined;
    return (
        <div className={cn(styles.itemMobile)} {...props}>
            <div className="flex justify-between">
                <div>
                    {startIcon && <span className={styles.iconWrapper}>{startIcon}</span>}
                    {secondItem &&
                        <div className={cn("flex gap-x-1", styles.secondItem)}>
                            {secondItem.title}
                            {getElement(secondItem)}
                        </div>
                    }
                    {firstItem && <span className={cn(styles.firstItem, "flex gap-1")}>{
                        firstItem.map(obj => getElement(obj))
                    }</span>}
                </div>
                <Action actions={actions} />
            </div>
            <hr className={styles.hr}></hr>
            <div className={styles.bottomItemsWrap}>
                {itemsFiltered && itemsFiltered.map((item, key) => {
                    return (
                        <div key={key}>
                            <span className={styles.mobileTitle}>{item.title}</span>
                            {getElement(item)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Action = ({ actions, ...props }: ActionProps): JSX.Element => {
    return (
        <div className={styles.actions} {...props}>
            {actions && actions.map((action, index) => {
                switch (action) {
                    case "editAndSave":
                        return <EditIcon key={index} />;
                    case "delete":
                        return <DeleteIcon key={index} />;
                    case "addComment":
                        return <CommectIcon key={index} className={styles.comment} />;
                    case "download":
                        return <DownloadIcon key={index} />;
                }
            })}
        </div>
    );
};

const TableText = ({ text, ...props }: TableTextProps) => {
    return (
        <div {...props}>
            {text ? (
                <div className={styles.rowContent}>{text}</div>
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

const TableTag = ({ text, ...props }: TableTagProps) => {
    return (
        <div {...props} className={styles.rowContent}>
            <Tag className={styles.rowTag} appearance="primary-border" size="s">
                {text}
            </Tag>
        </div>
    );
};