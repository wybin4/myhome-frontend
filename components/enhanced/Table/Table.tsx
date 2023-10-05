import { TableProps } from "./Table.props";
import styles from "./Table.module.css";
import cn from "classnames";
import { Button, Htag, TableFilter, TableRow, TableSearch } from "@/components";
import { useState, useEffect, useRef } from "react";

export const Table = ({
    title, buttons,
    filters,
    rows,
    className, ...props
}: TableProps): JSX.Element => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterRef = useRef(null);
    const filterButtonRef = useRef(null);

    const closeFiltersOnOutsideClick = (e: MouseEvent) => {
        if (window.innerWidth <= 900) {
            if (
                filterRef.current &&
                !(filterRef.current as Node).contains(e.target as Node) &&
                filterButtonRef.current &&
                !(filterButtonRef.current as Node).contains(e.target as Node)
            ) {
                setIsFilterOpened(false);
            }
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeFiltersOnOutsideClick);
        return () => {
            document.removeEventListener("click", closeFiltersOnOutsideClick);
        };
    }, []);

    return (
        <div className={className} {...props}>
            <div>
                <div className={styles.topPart}>
                    <Htag size="h1" className={styles.title}>{title}</Htag>
                    <div className={styles.buttonWrapper}>
                        {buttons && buttons.map((button, key) => {
                            switch (button.type) {
                                case "add":
                                    return (
                                        <Button
                                            symbol="add" size="m" appearance="primary"
                                            onClick={button.onClick}
                                            key={key}
                                        >Добавить</Button>
                                    );
                                case "download":
                                    return (
                                        <Button
                                            symbol="download" size="m" appearance="ghost"
                                            onClick={button.onClick}
                                            key={key}
                                        >Загрузить</Button>
                                    );
                                case "upload":
                                    return (
                                        <Button
                                            symbol="upload" size="m" appearance="ghost"
                                            onClick={button.onClick}
                                            key={key}
                                        >Скачать</Button>
                                    );
                            }
                        })}
                        <span className={styles.filterIcon}>
                            <Button
                                symbol="filter"
                                size="m"
                                appearance="ghost"
                                onClick={() => setIsFilterOpened(!isFilterOpened)}
                                innerRef={filterButtonRef}
                            >
                                Фильтры
                            </Button>
                        </span>
                    </div>
                </div>
                <div className={styles.bottomPart}>
                    <div className="w-full">
                        <TableSearch size="l" className={styles.searchBar} />
                        <TableRow {...rows} className={cn("mt-8", styles.rows)} />
                    </div>
                    {filters.length !== 0 &&
                        <TableFilter
                            isOpen={isFilterOpened}
                            setIsOpen={setIsFilterOpened}
                            title="Фильтры"
                            items={filters}
                            className={styles.filter}
                            innerRef={filterRef}
                        />}
                </div>
            </div>
        </div>
    );
};
