import { ButtonProps } from "./Button.props";
import styles from "./Button.module.css";
import cn from "classnames";
import DownloadIcon from './download.svg';
import UploadIcon from './upload.svg';
import FilterIcon from "./filter.svg";

export const Button = ({
    symbol = "none",
    appearance, size,
    children, innerRef, className, ...props
}: ButtonProps): JSX.Element => {
    return (
        <button
            className={cn(styles.button, className, {
                [styles.primary]: appearance === "primary",
                [styles.ghost]: appearance === "ghost",
                [styles.l]: size === "l",
                [styles.m]: size === "m",
                [styles.s]: size === "s",
            })}
            ref={innerRef}
            {...props}
        >
            {symbol !== "none" &&
                <span className={styles.symbol}>
                    {symbol === "download" && <DownloadIcon className={styles.download} />}
                    {symbol === "upload" && <UploadIcon className={styles.upload} />}
                    {symbol === "add" && <span>+</span>}
                    {symbol === "filter" && <FilterIcon className={styles.filter} />}
                </span>}
            <span className={cn({
                "sm:hidden md:hidden lg:hidden": symbol !== "none"
            })}>{children}</span>
        </button >
    );
};