import { TableSearchProps } from "./TableSearch.props";
import SearchIcon from './search.svg';
import styles from "./TableSearch.module.css";
import cn from 'classnames';

export const TableSearch = ({ className, size, ...props }: TableSearchProps): JSX.Element => {
    return (
        <>
            <div className={cn(className, {
                [styles.l]: size === "l",
                [styles.s]: size === "s",
            }
            )} {...props}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className={styles.searchIcon} />
                    </div>
                    <input type="search" className={cn(
                        styles.searchInput,
                        "focus:ring-4 focus:ring-violet-200"
                    )} placeholder="Поиск" />
                </div>
            </div>
        </>
    );
};