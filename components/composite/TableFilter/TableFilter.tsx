import { Checkbox, DatePickerRange, Radio, Search } from "@/components";
import { TableFilterItemProps, TableFilterProps } from "./TableFilter.props";
import ArrowIcon from './arrow.svg';
import { useEffect, useRef, useState } from "react";
import styles from "./TableFilter.module.css";
import cn from 'classnames';
import { IBaseDateRange, IDateRange } from "@/components/primitive/DatePicker/DatePicker.props";

export const TableFilter = ({
    filterButtonRef,
    isOpen, setIsOpen,
    title, items,
    isOne,
    className, ...props
}: TableFilterProps): JSX.Element => {
    const filterRef = useRef(null);

    const closeFiltersOnOutsideClick = (e: MouseEvent) => {
        if (window.innerWidth <= 900) {
            if (
                filterRef.current &&
                !(filterRef.current as Node).contains(e.target as Node) &&
                filterButtonRef.current &&
                !(filterButtonRef.current as Node).contains(e.target as Node)
            ) {
                setIsOpen(false);
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
        <>
            {isOne &&
                <>
                    {<div {...props}
                        className={cn(
                            styles.filterWrapper,
                            "lg:hidden md:hidden sm:hidden", className
                        )}
                        ref={filterRef}>
                        <div className={styles.titleWrapper}>
                            <ArrowIcon
                                className={styles.closeFiltersArrow}
                                onClick={() => setIsOpen(!isOpen)}
                            />
                            <p className={styles.mainTitle}>{title}</p>
                        </div>
                        {items && items.map((item, key) => <TableFilterItem key={key}{...item} />)}
                    </div>}
                    <div {...props} className={cn(
                        styles.filterWrapper,
                        "3xl:hidden 2xl:hidden xl:hidden",
                        { [styles.hidden]: !isOpen },
                        className
                    )} ref={filterRef}>
                        <div className={styles.titleWrapper}>
                            <ArrowIcon
                                className={styles.closeFiltersArrow}
                                onClick={() => setIsOpen(!isOpen)}
                            />
                            <p className={styles.mainTitle}>{title}</p>
                        </div>
                        {items && items.map((item, key) => <TableFilterItem key={key}{...item} />)}
                    </div>
                </>
            }
        </>
    );
};

export const TableFilterItem = ({
    items,
    type, handleClick, handleDateRangeClick,
    title, titleEng,
    isRadio = false, numberText = "",
    ...props
}: TableFilterItemProps): JSX.Element => {
    const [hidden, setHidden] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number>(0);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [choosedDate, setChoosedDate] = useState<Omit<IDateRange, "focusedInput"> | undefined>({
        startDate: new Date(),
        endDate: new Date()
    });
    const [searchValue, setSearchValue] = useState<string | number | undefined>();

    const handleItemClick = (index: number) => {
        if (!isRadio) {
            setSelectedItem(selectedItem === index ? 0 : index);
        } else {
            setSelectedItem(index);
        }
    };

    const addItem = (array: string[], item: string) => {
        const index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
        } else {
            array.push(item);
        }
        return array;
    };

    return (
        <>
            {

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
                        {items && items.length > 0 &&
                            <>
                                {type !== "checkboxWithoutSearch" && type !== "date" && type !== "number" &&
                                    <div className="mb-3">
                                        <Search
                                            size="s"
                                            value={searchValue} setValue={setSearchValue}
                                        />
                                    </div>
                                }
                                {items && <div className={styles.valuesWrapper} style={{
                                    height: `${items
                                        .filter(item => {
                                            if (searchValue) {
                                                return item.text.toLowerCase().includes(String(searchValue).toLowerCase());
                                            }
                                            return true;
                                        }).length + 1}rem`
                                }}>{
                                        items
                                            .filter(item => {
                                                if (searchValue) {
                                                    return item.text.toLowerCase().includes(String(searchValue).toLowerCase());
                                                }
                                                return true;
                                            })
                                            .map((item, index) => {
                                                if (isRadio) {
                                                    return (
                                                        <Radio
                                                            checked={selectedItem === index}
                                                            onClick={() => {
                                                                if (handleClick) {
                                                                    setSelectedItems((prev) => [...prev, String(item.value)]);
                                                                    handleClick([...selectedItems, String(item.value)], titleEng);
                                                                }
                                                                handleItemClick(index);
                                                            }}
                                                            forString={`${titleEng}_${index}`}
                                                            key={index}
                                                        >
                                                            {item.text}
                                                        </Radio>
                                                    );
                                                } else {
                                                    return (
                                                        <Checkbox
                                                            onClick={() => {
                                                                if (handleClick) {
                                                                    let items = [...selectedItems];
                                                                    const itemValue = String(item.value);
                                                                    items = addItem(items, itemValue);
                                                                    setSelectedItems(items);
                                                                    handleClick(items, titleEng);
                                                                }
                                                            }}
                                                            forString={`${titleEng}_${index}`}
                                                            key={index}
                                                        >
                                                            {item.text}
                                                        </Checkbox>
                                                    );
                                                }
                                            })
                                    }</div>}
                            </>
                        }
                        {type === "number" &&
                            <div className="flex items-center gap-3">
                                <p className={styles.numberInputText}>{numberText}</p>
                                <input type="number" min="10" max="30"
                                    className={cn(styles.numberInput, "focus:ring-4 focus:ring-violet-200")}
                                />
                            </div>
                        }
                        {type === "date" &&
                            <DatePickerRange
                                choosedDates={choosedDate}
                                setChoosedDates={(newDates: IBaseDateRange | undefined) => {
                                    if (handleDateRangeClick && newDates) {
                                        handleDateRangeClick(newDates, titleEng);
                                        setChoosedDate(newDates);
                                    }
                                }} />
                        }
                    </div>
                </div>
            }
        </>
    );
};