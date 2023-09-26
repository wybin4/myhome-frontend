import React, { useState, useEffect, useRef, ForwardedRef, forwardRef } from "react";
import { SelectProps, SelectorOption } from "./Select.props";
import styles from "./Select.module.css";
import cn from "classnames";
import ArrowIcon from "./arrow.svg";

export const Select = forwardRef(({
    id,
    selected, setSelected,
    inputTitle, inputError,
    options,
    size = "s",
    className
}: SelectProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (e: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleOptionClick = (option: SelectorOption) => {
        setSelected(option);
        setIsOpen(false);
    };

    return (
        <div className={cn(styles.select, className, {
            [styles.s]: size === "s",
            [styles.m]: size === "m",
            [styles.inputError]: inputError
        })} ref={ref}>
            {inputTitle && <div className={styles.inputTitle}>{inputTitle}</div>}
            <button
                className={cn(styles.button, {
                    "focus:ring-4 focus:ring-violet-200": !inputError,
                    "focus:ring-4 focus:ring-red-200": inputError,
                })}
                data-value={selected?.value}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                ref={selectRef}
            >
                <span>{selected?.text}</span>
                <ArrowIcon className={cn(styles.icon, {
                    [styles.arrowDown]: isOpen
                })} />
            </button>
            <ul
                className={cn(styles.list, {
                    [styles.visibleList]: isOpen,
                })}
                id={`list-${id}`}
            >
                {options.map((option: SelectorOption, index: number) => (
                    <li
                        key={index}
                        className={styles.listItem}
                        data-value={option.value}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option.text}
                    </li>
                ))}
            </ul>
            {inputError && <span className={styles.error}>{inputError}</span>}
        </div>
    );
});