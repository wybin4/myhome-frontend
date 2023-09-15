import { ParagraphProps } from "./Paragraph.props";
import styles from "./Paragraph.module.css";
import cn from 'classnames';

export const Paragraph = ({ className, size, children, ...props }: ParagraphProps): JSX.Element => {
    return <p className={cn(styles.p, className, {
        [styles.l]: size === "l",
        [styles.m]: size === "m",
        [styles.s]: size === "s",
        [styles.xs]: size === "xs",
    })} {...props}>{children}</p>;
};