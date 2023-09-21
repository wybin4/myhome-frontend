import { AppContext } from "@/context/app.context";
import { useContext, useEffect, useState } from "react";
import { NavigationProps } from "./Navigation.props";
import { IMenu } from "@/interfaces/menu.interface";
import styles from "./Navigation.module.css";
import cn from 'classnames';

export const Navigation = ({ ...props }: NavigationProps): JSX.Element => {
    const { role, setRole } = useContext(AppContext);
    const [activeItem, setActiveItem] = useState<number>(0);

    useEffect(() => {
        setRole && setRole("managementCompany");
    });

    const menu: IMenu[] = [
        {
            role: "owner", items:
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
                currentMenu.items.map((menuItem, key) => {
                    return <div key={menuItem.route}
                        className={cn(styles.item, {
                            [styles.activeItem]: activeItem === menuItem.number
                        })}
                        onClick={() => setActiveItem(key)}
                    >
                        <a href={`/${menuItem.route}`}>
                            <span>{menuItem.name}</span>
                        </a>
                    </div>;
                }
                )}
        </div>
    );
};