import { InputProps } from "./Input.props";
import styles from "./Input.module.css";
import cn from 'classnames';
import { ChangeEvent, ForwardedRef, forwardRef } from "react";

export const Input = forwardRef(({
    title, placeholder, textAlign = "left",
    size,
    value, setValue, inputType = "string",
    icon, sizeOfIcon = "normal", alignOfIcon = "left",
    className,
    readOnly = false, datePicker = false,
    inputError,
    ...props
}: InputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (inputType === "number") {
            const inputValue = event.target.value;
            if (/^\d+(\.\d*)?$/.test(inputValue)) {
                setValue && setValue(inputValue);
            } else if (inputValue === "") {
                setValue && setValue("");
            }
        } else {
            setValue && setValue(event.target.value);
        }
    };

    return (
        <>
            <div className={cn(className, styles.inputWrapper, {
                [styles.inputError]: inputError
            })}>
                {title && <div className={styles.inputTitle}>{title}</div>}
                <div className={cn("relative", {
                    [styles.l]: size === "l",
                    [styles.m]: size === "m",
                    [styles.s]: size === "s",
                }
                )}>
                    <input
                        autoComplete="off"
                        ref={ref}
                        className={cn(
                            styles.input,
                            {
                                "text-center": textAlign === "center",
                                "text-left": textAlign === "left",
                                [styles.bigInput]: sizeOfIcon === "big",
                                [styles.normalInput]: sizeOfIcon === "normal",
                                "focus:ring-4 focus:ring-violet-200": !readOnly && !inputError && !datePicker,
                                "focus:ring-4 focus:ring-red-200": !readOnly && inputError,
                                [styles.readonly]: readOnly,
                                [styles.datepicker]: datePicker,
                                [styles.svgM]: icon && size === "m"
                            },
                        )} value={value ? value : ""}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        readOnly={readOnly || datePicker}
                        type={inputType === "password" ? "password" : undefined}
                        {...props} />
                    {icon &&
                        <div className={cn(styles.icon, "absolute inset-y-0 flex items-center pointer-events-none",
                            {
                                "right-0 pr-3": alignOfIcon === "right",
                                "left-0 pl-3": alignOfIcon === "left",
                                [styles.big]: sizeOfIcon === "big",
                                [styles.normal]: sizeOfIcon === "normal",
                            })}>
                            {icon}
                        </div>
                    }
                </div>
                {inputError && <span className={styles.error}>{inputError}</span>}
            </div>
        </>
    );
});