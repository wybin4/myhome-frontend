import React from "react";
import { PaginationProps } from "./Pagination.props";
import styles from "./Pagination.module.css";
import cn from "classnames";
import ReactPaginate from 'react-paginate';
import PrevIcon from "./prev.svg";
import NextIcon from "./next.svg";

export const Pagination = ({
    itemsPerPage, itemsCount,
    setItemOffset, handlePaginate
}: PaginationProps): JSX.Element => {
    const pageCount = Math.ceil(itemsCount / itemsPerPage);

    const handlePageClick = async (selectedItem: { selected: number }) => {
        if (handlePaginate) {
            const newOffset = (selectedItem.selected * itemsPerPage) % itemsCount;
            setItemOffset(newOffset);
            handlePaginate(selectedItem.selected);
        }
    };

    if (itemsCount <= itemsPerPage) {
        return <></>;
    }

    return (
        <>
            <div className={styles.mobilePagination}>
                <ReactPaginate
                    pageRangeDisplayed={-1}
                    marginPagesDisplayed={0}
                    breakClassName={cn(styles.item, styles.break)}
                    activeClassName={cn(styles.item, styles.active)}
                    pageClassName={cn(styles.item)}
                    containerClassName="flex justify-between"
                    breakLabel="..."
                    nextLabel={<button className={styles.text}>Следующая</button>}
                    onPageChange={handlePageClick}
                    pageCount={pageCount}
                    previousLabel={<button className={styles.text}>Предыдущая</button>}
                    renderOnZeroPageCount={null}
                    disabledClassName={styles.disable}
                />
            </div>
            <div className={styles.desktopPagination}>
                <ReactPaginate
                    breakClassName={cn(styles.item, styles.break)}
                    activeClassName={cn(styles.item, styles.active)}
                    pageClassName={cn(styles.item)}
                    className="flex items-baseline"
                    breakLabel="..."
                    nextLabel={<span className={styles.icon}><NextIcon /></span>}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel={<span className={styles.icon}><PrevIcon /></span>}
                    renderOnZeroPageCount={null}
                    disabledClassName={styles.disable}
                />
            </div>
        </>
    );
};