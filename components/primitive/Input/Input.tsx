import { InputProps } from "./Input.props";
import styles from "./Input.module.css";
import cn from 'classnames';
import { ChangeEvent } from "react";

export const Input = ({
    title,
    value, setValue,
    icon, sizeOfIcon = "normal",
    placeholder, className, size, textAlign = "left",
    readOnly = false,
    innerRef,
    ...props
}: InputProps): JSX.Element => {

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue && setValue(event.target.value);
    };

    return (
        <>
            <div>
                {title && <div className={styles.inputTitle}>{title}</div>}
                <div className={cn(className, styles.inputWrapper, "relative", {
                    [styles.l]: size === "l",
                    [styles.m]: size === "m",
                    [styles.s]: size === "s",
                }
                )}>
                    <input
                        ref={innerRef}
                        className={cn(
                            styles.input,
                            {
                                "text-center": textAlign === "center",
                                "text-left": textAlign === "left",
                                [styles.bigInput]: sizeOfIcon === "big",
                                [styles.normalInput]: sizeOfIcon === "normal",
                                "focus:ring-4 focus:ring-violet-200": !readOnly,
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
            </div>
        </>
    );
};