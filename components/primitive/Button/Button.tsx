import { ButtonProps } from "./Button.props";
import styles from "./Button.module.css";
import cn from "classnames";
import DownloadIcon from './download.svg';
import UploadIcon from './upload.svg';

export const Button = ({
    symbol = "none",
    appearance, size,
    children, className, ...props
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
            {...props}
        >
            {symbol !== "none" && <span className={cn(styles.symbol, {
                [styles.download]: symbol === "download",
                [styles.upload]: symbol === "upload",
                [styles.add]: symbol === "add",
            })}
            >
                {symbol === "download" && <DownloadIcon className={styles.download} />}
                {symbol === "upload" && <UploadIcon className={styles.upload} />}
                {symbol === "add" && <span>+</span>}
            </span>}
            {children}
        </button >
    );
};