import { Checkbox, DatePickerInput, Radio, TableSearch } from "@/components";
import { TableFilterItemProps, TableFilterProps } from "./TableFilter.props";
import ArrowIcon from './arrow.svg';
import { useEffect, useRef, useState } from "react";
import styles from "./TableFilter.module.css";
import cn from 'classnames';

export const TableFilter = ({
    filterButtonRef,
    isOpen, setIsOpen,
    title, items,
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
            </div >
        </>
    );
};

export const TableFilterItem = ({
    items,
    type, onClick,
    title, titleEng,
    isRadio = false, numberText = "",
    ...props
}: TableFilterItemProps): JSX.Element => {
    const [hidden, setHidden] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number>(0);

    const handleItemClick = (index: number) => {
        if (!isRadio) {
            setSelectedItem(selectedItem === index ? 0 : index);
        } else {
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
                    {type === "number" &&
                        <div className="flex items-center gap-3">
                            <p className={styles.numberInputText}>{numberText}</p>
                            <input type="number" min="10" max="30"
                                className={cn(styles.numberInput, "focus:ring-4 focus:ring-violet-200")}
                            />
                        </div>
                    }
                    {type !== "checkboxWithoutSearch" && type !== "date" && type !== "number" &&
                        <div className="mb-3">
                            <TableSearch size="s" />
                        </div>
                    }
                    {items && <div className="flex flex-col gap-1">{
                        items.map((item, index) => {
                            if (isRadio) {
                                return (
                                    <Radio
                                        checked={selectedItem === index}
                                        onClick={() => {
                                            if (onClick) {
                                                onClick();
                                            }
                                            handleItemClick(index);
                                        }}
                                        forString={`${titleEng}_${index}`}
                                        key={index}
                                    >
                                        {item}
                                    </Radio>
                                );
                            } else {
                                return (
                                    <Checkbox
                                        onClick={() => {
                                            if (onClick) {
                                                onClick();
                                            }
                                        }}
                                        forString={`${titleEng}_${index}`}
                                        key={index}
                                    >
                                        {item}
                                    </Checkbox>
                                );
                            }
                        })
                    }</div>}
                    {type === "date" && <DatePickerInput />}
                </div>
            </div>
        </>
    );
};