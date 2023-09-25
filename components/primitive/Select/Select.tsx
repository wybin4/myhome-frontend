import React, { useState, useEffect, useRef } from "react";
import { SelectProps } from "./Select.props";
import styles from "./Select.module.css";
import cn from "classnames";
import ArrowIcon from "./arrow.svg";

export const Select = ({
    id, inputTitle, options,
    size = "s",
    className
}: SelectProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<{
        value: string;
        text: string;
    }>();
    const selectRef = useRef<HTMLDivElement | null>(null);

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

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: {
        value: string;
        text: string;
    }) => {
        setSelected(option);
        setIsOpen(false);
    };

    return (
        <div className={cn(styles.select, className, {
            [styles.s]: size === "s",
            [styles.m]: size === "m",
        })} ref={selectRef}>
            {inputTitle && <div className={styles.inputTitle}>{inputTitle}</div>}
            <button
                className={cn(styles.button, "focus:ring-4 focus:ring-violet-200")}
                data-value={selected?.value}
                type="button"
                onClick={handleButtonClick}
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
                {options.map((option: { value: string; text: string; }, index: number) => (
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
        </div>
    );
};