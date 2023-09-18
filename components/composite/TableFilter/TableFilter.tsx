import { Checkbox, DatePickerInput, TableSearch } from "@/components";
import { TableFilterItemProps, TableFilterProps } from "./TableFilter.props";
import ArrowIcon from './arrow.svg';
import { useState } from "react";
import styles from "./TableFilter.module.css";
import cn from 'classnames';

export const TableFilter = ({ title, items, ...props }: TableFilterProps): JSX.Element => {
    return (
        <>
            <div {...props} className="w-[11.5rem]">
                <p className="font-medium text-lg mb-4">{title}</p>
                {items.length && items.map((item, key) => <TableFilterItem key={key}{...item} />)}
            </div>
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
                    <p className="font-[0.9375rem] leading-5 font-medium mb-4">{title}</p>
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
                    {items?.length && <div className="flex flex-col gap-1">{
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