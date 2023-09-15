import { IconProps } from "./Icon.props";
import styles from "./Icon.module.css";
import cn from 'classnames';

export const Icon = ({ className, children, type, appearance = "primary", size, ...props }: IconProps): JSX.Element => {
    return (
        <>
            <span className={cn(styles.icon, className, {
                [styles.s]: size === "s",
                [styles.l]: size === "l",
                [styles.m]: size === "m",
                [styles.primary]: appearance === "primary",
                [styles.none]: appearance === "none",
                [styles.icon]: type === "icon",
                [styles.iconRounded]: type === "iconRounded",
            })} {...props}>
                {children}
            </span>
        </>
    );
};