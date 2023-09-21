import { HeaderProps } from "./Header.props";
import styles from "./Header.module.css";
import LogoIcon from "./logo.svg";

export const Header = ({ ...props }: HeaderProps): JSX.Element => {
    return (
        <>
            <div {...props}>
                <LogoIcon className={styles.logo} />
                <p className={styles.title}>Мой дом</p>
            </div>
        </>
    );
};