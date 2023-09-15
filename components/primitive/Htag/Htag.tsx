import { HtagProps } from "./Htag.props";
import styles from "./Htag.module.css";
import cn from 'classnames';

export const Htag = ({ className, size, children }: HtagProps): JSX.Element => {
    switch (size) {
        case "h1":
            return <h1 className={cn(styles.h1, className)}>{children}</h1>;
        case "h2":
            return <h2 className={cn(styles.h2, className)}>{children}</h2>;
        case "h3":
            return <h3 className={cn(styles.h3, className)}>{children}</h3>;
        default:
            return <></>;
    }
};