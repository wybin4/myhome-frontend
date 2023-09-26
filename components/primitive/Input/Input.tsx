import { InputProps } from "./Input.props";
import styles from "./Input.module.css";
import cn from 'classnames';
import { ChangeEvent, ForwardedRef, forwardRef } from "react";

export const Input = forwardRef(({
    title, placeholder, textAlign = "left",
    size,
    value, setValue,
    icon, sizeOfIcon = "normal",
    className,
    readOnly = false,
    inputError,
    ...props
}: InputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue && setValue(event.target.value);
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
                                "focus:ring-4 focus:ring-violet-200": !readOnly && !inputError,
                                "focus:ring-4 focus:ring-red-200": !readOnly && inputError,
                                [styles.readonly]: readOnly
                            },
                        )} value={value} onChange={handleInputChange} placeholder={placeholder} readOnly={readOnly} {...props} />
                    {icon &&
                        <div className={cn("absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none",
                            {
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