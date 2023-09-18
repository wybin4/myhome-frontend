import styles from '../DatePicker.module.css';
import { NavButtonProps } from '../DatePicker.props';
import cn from "classnames";

export const NavButton = ({ children, onClick, className }: NavButtonProps): JSX.Element => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(styles.navButton, className)}
        >
            {children}
        </button>
    );
};
