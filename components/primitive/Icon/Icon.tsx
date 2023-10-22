import { IconProps } from "./Icon.props";
import styles from "./Icon.module.css";
import cn from 'classnames';

export const Icon = ({
    className, children,
    type, appearance = "primary", size,
    fillType = "fill",
    ...props
}: IconProps): JSX.Element => {
    return (
        <>
            <span className={cn(styles.icon, className, {
                [styles.xs]: size === "xs",
                [styles.s]: size === "s",
                [styles.l]: size === "l",
                [styles.m]: size === "m",
                [styles.fill]: fillType === "fill",
                [styles.stroke]: fillType === "stroke",
                [styles.primary]: appearance === "primary",
                [styles.red]: appearance === "red",
                [styles.green]: appearance === "green",
                [styles.none]: appearance === "none",
                [styles.icon]: type === "icon",
                [styles.iconRounded]: type === "iconRounded",
            })} {...props}>
                {children}
            </span>
        </>
    );
};