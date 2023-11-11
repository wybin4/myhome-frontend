import { AppContext } from "@/context/app.context";
import { useContext, useEffect, useState } from "react";
import { NavigationProps } from "./Navigation.props";
import { IMenu } from "@/interfaces/menu.interface";
import styles from "./Navigation.module.css";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import CloseIcon from "../close.svg";
import MenuIcon from "./menu.svg";
import { UserRole } from "@/interfaces/account/user.interface";

export const Navigation = ({ className, ...props }: NavigationProps): JSX.Element => {
    const { role, setRole } = useContext(AppContext);
    const [isMenu, setIsMenu] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setRole && setRole(UserRole.Admin);
    });

    const menu: IMenu[] = [
        {
            role: UserRole.Owner, items:
                [{
                    name: "Счётчики", route: "meter", number: 0,
                },
                {
                    name: "Начисления", route: "charge", number: 1,
                },
                {
                    name: "События", route: "event", number: 2,
                },
                {
                    name: "Обращения", route: "appeal", number: 3,
                }],
        },
        {
            role: UserRole.ManagementCompany, items:
                [{
                    name: "Справочники", route: "reference", number: 0,
                },
                {
                    name: "Квитанции", route: "spd", number: 1,
                },
                {
                    name: "Опросы", route: "voting", number: 2,
                },
                {
                    name: "Обращения", route: "appeal", number: 3,
                },
                {
                    name: "Уведомления", route: "house-notification", number: 4,
                }]
        },
        {
            role: UserRole.Admin, items:
                [{
                    name: "Справочники", route: "reference", number: 0,
                },
                {
                    name: "Отчеты", route: "report", number: 1,
                }]
        },
    ];
    const currentMenu = menu.find((m: IMenu) => m.role === role);

    const getCursiveRole = (role: UserRole) => {
        switch (role) {
            case UserRole.Admin:
                return "admin";
            case UserRole.ManagementCompany:
                return "management-company";
            case UserRole.Owner:
                return "owner";
            default: return "none";
        }
    };

    return (
        <>
            {isMenu && <span onClick={() => setIsMenu(!isMenu)} className={styles.closeIcon}><CloseIcon /></span>}
            {!isMenu && <span onClick={() => setIsMenu(!isMenu)} className={styles.menuIcon}><MenuIcon /></span>}
            {isMenu &&
                <div className={cn(className, styles.mobileNavWrapper)} {...props}>
                    <p className={styles.mobileText}>Навигация по сайту</p>
                    {role !== UserRole.None &&
                        currentMenu &&
                        currentMenu.items.map(menuItem => {
                            return <div key={menuItem.route}
                                className={cn(styles.item, {
                                    [styles.activeItem]: router.asPath.split("/")[2] == menuItem.route
                                })}
                            >
                                <Link href={`/${getCursiveRole(currentMenu.role)}/${menuItem.route}`}>
                                    <span>{menuItem.name}</span>
                                </Link>
                            </div>;
                        })}
                </div>
            }
            <div className={cn(className, styles.desktopNavWrapper)} {...props}>
                {role !== UserRole.None &&
                    currentMenu &&
                    currentMenu.items.map(menuItem => {
                        return <div key={menuItem.route}
                            className={cn(styles.item, {
                                [styles.activeItem]: router.asPath.split("/")[2] == menuItem.route
                            })}
                        >
                            <Link href={`/${getCursiveRole(currentMenu.role)}/${menuItem.route}`}>
                                <span>{menuItem.name}</span>
                            </Link>
                        </div>;
                    })}
            </div>
        </>
    );
};