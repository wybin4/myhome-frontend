import { UlProps } from "./Ul.props";
import styles from "./Ul.module.css";
import cn from "classnames";
import { useState } from "react";
import { Search } from "../TableSearch/TableSearch";

export const Ul = ({
    li, title,
    className, ...props
}: UlProps): JSX.Element => {

    const [searchValue, setSearchValue] = useState<string | number | undefined>();

    return (
        <div className={cn("flex flex-col pt-4", className)} {...props}>
            <div className={styles.title}>{title}</div>
            <Search
                size="s"
                className="mb-3"
                value={searchValue} setValue={setSearchValue}
            />
            <div className={styles.liWrapper}>
                {
                    li.filter(item => {
                        if (searchValue) {
                            return item.toLowerCase().includes(String(searchValue).toLowerCase());
                        }
                        return true;
                    }).map((l, i) => <div className={styles.li} key={i}>{l}</div>)
                }
            </div>
        </div>
    );
};