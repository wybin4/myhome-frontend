import { MenuItemProps, MenuProps } from "./Menu.props";
import styles from "./Menu.module.css";
import cn from 'classnames';
import { Icon, Paragraph } from "@/components";
import Link from "next/link";

export const Menu = ({ title, items, className, ...props }: MenuProps): JSX.Element => {
    return (
        <>
            <div className={cn(styles.referenceMenu, className)} {...props}>
                <Paragraph size="l" className={styles.menuTitle}>{title}</Paragraph>
                {items && items.map((item, key) => <MenuItem key={key} {...item} />)}
            </div>
        </>
    );
};

export const MenuItem = ({ title, text, icon, href, ...props }: MenuItemProps): JSX.Element => {
    return (
        <>
            <Link className={cn(styles.referenceMenuItem)} href={href}>
                <Icon type="icon" appearance="primary" size="s" className={styles.logoIcon}>{icon}</Icon>
                <div className={styles.textBlock}>
                    <Paragraph size="m" className={styles.itemTitle}>{title}</Paragraph>
                    <Paragraph size="xs" className={styles.itemText}>{text}</Paragraph>
                </div>
            </Link>
        </>
    );
};