import { TagProps } from "./Tag.props";
import styles from "./Tag.module.css";
import cn from 'classnames';

export const Tag = ({ appearance = "primary", size, children, className, ...props }: TagProps): JSX.Element => {
    return <p className={cn(styles.tag, className, {
        [styles.l]: size === "l",
        [styles.m]: size === "m",
        [styles.s]: size === "s",
        [styles.primary]: appearance === "primary",
        [styles.primaryBorder]: appearance === "primary-border",
        [styles.red]: appearance === "red",
        [styles.green]: appearance === "green",
        [styles.grey]: appearance === "grey",
    })} {...props}> {children}</p >;
};