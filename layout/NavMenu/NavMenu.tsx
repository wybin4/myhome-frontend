import { useState } from "react";
import styles from "./NavMenu.module.css";
import { NavMenuProps } from "./NavMenu.props";
import cn from 'classnames';
import ExitIcon from './exit.svg';
import { useRouter } from "next/router";
import axios from "axios";
import { API } from "@/helpers/api";

export const NavMenu = ({  className, ...props }: NavMenuProps): JSX.Element => {
    const [isNavMenu, setIsNavMenu] = useState<boolean>(false);
    const router = useRouter();

    // useEffect(() => {
    //     if (isNavMenu) {
    //         document.body.style.overflowY = "hidden";
    //     } else document.body.style.overflowY = "";
    // }, [isNavMenu]);

    // const closeNavMenus = (e: MouseEvent) => {
    //     let targetClass;
    //     const target = e.target as HTMLElement | null;
    //     if (target) {
    //         if (!target.classList.contains("viewNavMenus")) {
    //             const parent = target.parentElement;
    //             if (parent && parent.classList.contains("viewNavMenus")) {
    //                 targetClass = parent.className;
    //             } else if (parent && parent.parentElement && parent.parentElement.classList.contains("viewNavMenus")) {
    //                 targetClass = parent.parentElement.className;
    //             }
    //         } else {
    //             targetClass = target.className;
    //         }
    //     }
    //     if (
    //         !(targetClass && targetClass?.split(" ")?.includes("viewNavMenus"))
    //     ) {
    //         setIsNavMenu(false);
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener("click", closeNavMenus);
    //     return () => {
    //         document.removeEventListener("click", closeNavMenus);
    //     };
    // }, []);

    const exit = async () => {
        await axios.get(API.auth.logout, {
            withCredentials: true
        });
        router.push("/login");
    };

    return (
        <>
            <div className={className} {...props}>
                {isNavMenu &&
                    <div className={cn(className, styles.desktop)} {...props}>

                    </div>
                }
                <div className={cn(className, styles.mobile)} {...props}>
                    <span onClick={() => exit()} className={styles.exitIcon}><ExitIcon /></span>
                </div>
            </div>
        </>
    );
};