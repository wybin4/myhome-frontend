import styles from "./TableButton.module.css";
import React from "react";
import { TableButtonProps } from "./TableButton.props";
import { Button } from "@/components";

export const TableButton = ({
    buttons, isFiltersExist,
    isFilterOpened, setIsFilterOpened,
    filterButtonRef, filterAppearance,
    ...props
}: TableButtonProps): JSX.Element => {

    return (
        <>
            <div className={styles.buttonWrapper} {...props}>
                {buttons && buttons.map((button, key) => {
                    switch (button.type) {
                        case "add":
                            return (
                                <Button
                                    symbol="add" size="m" appearance={button.appearance ? button.appearance : "primary"}
                                    onClick={button.onClick}
                                    key={key}
                                >{button.title ? button.title : "Добавить"}</Button>
                            );
                        case "download":
                            return (
                                <Button
                                    symbol="download" size="m" appearance={button.appearance ? button.appearance : "ghost"}
                                    onClick={button.onClick}
                                    key={key}
                                >Загрузить</Button>
                            );
                        case "upload":
                            return (
                                <Button
                                    symbol="upload" size="m" appearance={button.appearance ? button.appearance : "ghost"}
                                    onClick={button.onClick}
                                    key={key}
                                >Загрузить</Button>
                            );
                        case "calculate":
                            return (
                                <Button
                                    symbol="calculate" size="m" appearance={button.appearance ? button.appearance : "primary"}
                                    onClick={button.onClick}
                                    key={key}
                                >Сформировать</Button>
                            );
                    }
                })}
                {isFiltersExist &&
                    <span className={styles.filterIcon}>
                        <Button
                            symbol="filter"
                            size="m"
                            appearance={filterAppearance ? filterAppearance : "ghost"}
                            onClick={() => setIsFilterOpened(!isFilterOpened)}
                            innerRef={filterButtonRef}
                        >
                            Фильтры
                        </Button>
                    </span>}
            </div>
        </>
    );
};