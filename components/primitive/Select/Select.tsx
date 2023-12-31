import React, { useState, useRef, ForwardedRef, forwardRef, useEffect } from "react";
import { LittleRadioProps, LittleSelectProps, SelectProps, SelectorOption } from "./Select.props";
import styles from "./Select.module.css";
import cn from "classnames";
import ArrowIcon from "./arrow.svg";
import CheckedIcon from "./checked.svg";
import UnCheckedIcon from "./unchecked.svg";

export const Select = forwardRef(({
    id,
    selected, setSelected, handleSelect,
    title, inputError, setInputError, canIOpen,
    options,
    size = "s",
    className
}: SelectProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLButtonElement | null>(null);

    const handleOptionClick = (option: SelectorOption) => {
        if (handleSelect) {
            handleSelect(option.value);
        }
        setSelected(option);
        setIsOpen(false);
    };

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    useEffect(() => {
        if (!canIOpen?.flag && setInputError) {
            setInputError("");
        }
    }, [canIOpen?.flag]);

    const handleDocumentClick = (e: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    return (
        <div className={cn(styles.select, className, {
            [styles.s]: size === "s",
            [styles.m]: size === "m",
            [styles.inputError]: inputError
        })} ref={ref}>
            {title && <div className={styles.title}>{title}</div>}
            <button
                className={cn(styles.button, {
                    "focus:ring-4 focus:ring-violet-200": !inputError,
                    "focus:ring-4 focus:ring-red-200": inputError,
                })}
                data-value={selected?.value}
                type="button"
                onClick={() => {
                    if (canIOpen && canIOpen.flag) {
                        canIOpen.foo();
                        setIsOpen(false);
                    } else {
                        canIOpen && canIOpen.foo();
                        setIsOpen(!isOpen);
                    }
                }}
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

export const LittleSelect = forwardRef(({
    selected, setSelected,
    title, inputError,
    options,
    className
}: LittleSelectProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    return (
        <>
            <div className={cn(styles.select, className, {
                [styles.inputError]: inputError
            })} ref={ref}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={cn(styles.littleOptions, {
                    [styles.errorOptions]: inputError
                })}>
                    {options.map((option: SelectorOption, index: number) => {
                        return (
                            (
                                <LittleRadio
                                    key={index}
                                    option={option}
                                    checked={selected?.value === option.value}
                                    onClick={() => setSelected(option)}
                                />
                            )
                        );
                    })}
                </div>
                {inputError && <span className={styles.error}>{inputError}</span>}
            </div>
        </>
    );
});

const LittleRadio = ({ option, checked, onClick, ...props }: LittleRadioProps) => {
    return (
        <div className={styles.littleOption} onClick={onClick} {...props}>
            <span className={styles.littleIcon}>
                {checked && <span className={styles.checked}><CheckedIcon /></span>}
                <span className={styles.unchecked}><UnCheckedIcon /></span>
            </span>
            <label htmlFor={String(option)}>
                {option.text}
            </label>
        </div>
    );
};
