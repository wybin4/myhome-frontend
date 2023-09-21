import { AppContext } from "@/context/app.context";
import { useContext, useEffect } from "react";
import { NavigationProps } from "./Navigation.props";
import { IMenu } from "@/interfaces/menu.interface";
import styles from "./Navigation.module.css";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

export const Navigation = ({ ...props }: NavigationProps): JSX.Element => {
    const { role, setRole } = useContext(AppContext);

    const router = useRouter();

    useEffect(() => {
        setRole && setRole("subscriber");
    });

    const menu: IMenu[] = [
        {
            role: "subscriber", items:
                [{
                    name: "Счётчики", route: "meters", number: 0,
                },
                {
                    name: "Начисления", route: "charges", number: 1,
                },
                {
                    name: "События", route: "events", number: 2,
                },
                {
                    name: "Обращения", route: "appeals", number: 3,
                }],
        },
        {
            role: "managementCompany", items:
                [{
                    name: "Справочники", route: "references", number: 0,
                },
                {
                    name: "Квитанции", route: "spds", number: 1,
                },
                {
                    name: "Опросы", route: "votings", number: 2,
                },
                {
                    name: "Обращения", route: "appeals", number: 3,
                },
                {
                    name: "Уведомления", route: "notifications", number: 4,
                }]
        },
        {
            role: "admin", items:
                [{
                    name: "Справочники", route: "references", number: 0,
                },
                {
                    name: "Отчеты", route: "reports", number: 1,
                }]
        },
    ];
    const currentMenu = menu.find((m: IMenu) => m.role === role);

    return (
        <div {...props}>
            {role !== "none" &&
                currentMenu &&
                currentMenu.items.map(menuItem => {
                    return <div key={menuItem.route}
                        className={cn(styles.item, {
                            [styles.activeItem]: router.asPath.split("/")[2] == menuItem.route
                        })}
                    >
                        <Link href={`/${currentMenu.role}/${menuItem.route}`}>
                            <span>{menuItem.name}</span>
                        </Link>
                    </div>;
                }
                )}
        </div>
    );
};