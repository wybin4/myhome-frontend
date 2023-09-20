/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paragraph, Tag } from "@/components";
import { ActionProps, TableRowItemProps, TableRowProps } from "./TableRow.props";
import styles from "./TableRow.module.css";
import cn from 'classnames';
import DownloadIcon from "./download.svg";
import CommectIcon from "./comment.svg";
import DeleteIcon from "./delete.svg";
import EditIcon from "./edit.svg";
import React from "react";

export const TableRow = ({ startIcon, actions, items, className, ...props }: TableRowProps): JSX.Element => {
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
            <div className={cn("flex gap-12", styles.rowWrapper, className)} {...props}>
                {startIcon && <div className={cn("flex flex-col gap-4", styles.iconWrapper)}>
                    <Paragraph size="s" className="font-medium">⠀</Paragraph>
                    {getStartIcons()}
                </div>}
                {items && items.map((item, key) =>
                    <TableRowItem
                        key={key}
                        {...item} />)
                }
                {actions && <div className="flex flex-col gap-4">
                    <Paragraph size="s" className="font-medium">Действия</Paragraph>
                    {getActions()}
                </div>}
            </div>
        </>
    );
};

export const TableRowItem = ({ title, type, items, ...props }: TableRowItemProps): JSX.Element => {
    return (
        <div className="flex flex-col gap-4" {...props}>
            <Paragraph size="s" className="font-medium">{title}</Paragraph>
            {items && items.map((item, key) => {
                switch (type) {
                    case "tag":
                        return <div key={key} className={styles.rowContent}>
                            <Tag className={styles.rowTag} appearance="primary-border" size="s">{item}</Tag>
                        </div>;
                    case "text":
                        return (
                            <div key={key}>
                                {item && <div className={styles.rowContent}>{item}</div>}
                                {!item && <div className={styles.rowContent}>—</div>}
                            </div>
                        );
                    case "attachment":
                        return (
                            <div key={key}>
                                {item && <div className={cn(styles.underline, styles.rowContent)}>{item}</div>}
                                {!item && <div className={styles.rowContent}>—</div>}
                            </div>
                        );
                }
            })}
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