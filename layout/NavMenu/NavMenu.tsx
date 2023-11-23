import styles from "./NavMenu.module.css";
import { NavMenuProps } from "./NavMenu.props";
import cn from 'classnames';
import ExitIcon from './exit.svg';
import { useRouter } from "next/router";
import axios from "axios";
import { API } from "@/helpers/api";

export const NavMenu = ({ className, ...props }: NavMenuProps): JSX.Element => {
    const router = useRouter();

    const exit = async () => {
        await axios.get(API.auth.logout, {
            withCredentials: true
        });
        router.push("/login");
    };

    return (
        <>
            <div className={cn(className, styles.wrapper)} {...props}>
                <span onClick={() => exit()} className={styles.exitIcon}><ExitIcon /></span>
            </div>
        </>
    );
};