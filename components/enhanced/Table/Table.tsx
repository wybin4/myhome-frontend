import { TableProps } from "./Table.props";
import styles from "./Table.module.css";
import cn from "classnames";
import { Button, Htag, TableFilter, TableRow, TableSearch } from "@/components";
import { useState, useRef } from "react";

export const Table = ({
    title, buttons,
    filters,
    rows, isSearch = true,
    className, ...props
}: TableProps): JSX.Element => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterButtonRef = useRef(null);

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
                        {filters.length !== 0 &&
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
                            </span>}
                    </div>
                </div>
                <div className={styles.bottomPart}>
                    <div className="w-full">
                        {isSearch && <TableSearch size="l" className={cn("mb-8", styles.searchBar)} />}
                        <TableRow {...rows} className={styles.rows} />
                    </div>
                    {filters.length !== 0 &&
                        <TableFilter
                            isOpen={isFilterOpened}
                            setIsOpen={setIsFilterOpened}
                            title="Фильтры"
                            items={filters}
                            className={styles.filter}
                            filterButtonRef={filterButtonRef}
                        />}
                </div>
            </div>
        </div>
    );
};
