import { TableProps } from "./Table.props";
import styles from "./Table.module.css";
import cn from "classnames";
import { Htag, TableButton, TableFilter, TableRow, TableSearch } from "@/components";
import { useState, useRef } from "react";

export const Table = ({
    title, buttons,
    filters,
    rows, isSearch = true,
    className, ...props
}: TableProps): JSX.Element => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const [value, setValue] = useState<string | number>();
    const filterButtonRef = useRef(null);

    return (
        <div className={className} {...props}>
            <div>
                <div className={styles.topPart}>
                    {title && <Htag size="h1" className={styles.title}>{title}</Htag>}
                    {(buttons || filters) && <TableButton buttons={buttons}
                        isFiltersExist={filters !== undefined && filters.length !== 0}
                        filterButtonRef={filterButtonRef}
                        isFilterOpened={isFilterOpened} setIsFilterOpened={setIsFilterOpened}
                    />}
                </div>
                <div className={styles.bottomPart}>
                    <div className="w-full">
                        {isSearch && <TableSearch size="l" className={cn("mb-8", styles.searchBar)} value={value} setValue={setValue} />}
                        <TableRow {...rows} className={styles.rows} />
                    </div>
                    {filters && filters.length !== 0 &&
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
