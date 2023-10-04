import { Checkbox, DatePickerInput, TableSearch } from "@/components";
import { TableFilterItemProps, TableFilterProps } from "./TableFilter.props";
import ArrowIcon from './arrow.svg';
import { useState } from "react";
import styles from "./TableFilter.module.css";
import cn from 'classnames';

export const TableFilter = ({ innerRef, isOpen, setIsOpen, title, items, className, ...props }: TableFilterProps): JSX.Element => {
    return (
        <>
            {isOpen && <div {...props} className={cn(styles.filterWrapper, className)} ref={innerRef}>
                <div className={styles.titleWrapper}>
                    <ArrowIcon
                        className={styles.closeFiltersArrow}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    <p className={styles.mainTitle}>{title}</p>
                </div>
                {items && items.map((item, key) => <TableFilterItem key={key}{...item} />)}
            </div>}
        </>
    );
};

export const TableFilterItem = ({ items, type, title, titleEng, radio = false, ...props }: TableFilterItemProps): JSX.Element => {
    const [hidden, setHidden] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number>(0);

    const handleCheckboxChange = (index: number) => {
        if (radio) {
            setSelectedItem(index);
        }
    };

    return (
        <>
            <div {...props}>
                <div className="flex items-baseline justify-between">
                    <p className="text-[0.9375rem] leading-5 font-medium mb-4">{title}</p>
                    <ArrowIcon className={cn(
                        "justify-end cursor-pointer", {
                        [styles.arrowDown]: hidden,
                        [styles.arrowUp]: !hidden
                    })} onClick={() => setHidden(!hidden)} />
                </div>
                <div className={cn({
                    [styles.hidden]: hidden,
                    [styles.visible]: !hidden
                })}>
                    {type !== "checkboxWithoutSearch" && type !== "date" && <div className="mb-3"><TableSearch size="s" /></div>}
                    {items && <div className="flex flex-col gap-1">{
                        items.map((item, index) => {
                            return (
                                <Checkbox
                                    forString={`${titleEng}_${index}`}
                                    key={index}
                                    checked={radio ? selectedItem === index : undefined}
                                    onChange={() => handleCheckboxChange(index)}
                                >{item}</Checkbox>
                            );
                        })
                    }</div>}
                    {type === "date" && <DatePickerInput />}
                </div>
            </div>
        </>
    );
};