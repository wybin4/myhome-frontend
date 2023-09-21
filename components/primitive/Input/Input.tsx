import { InputProps } from "./Input.props";
import styles from "./Input.module.css";
import cn from 'classnames';

export const Input = ({
    value,
    icon, sizeOfIcon = "normal",
    placeholder, className, size, textAlign = "left",
    readOnly = false,
    innerRef,
    ...props
}: InputProps): JSX.Element => {
    return (
        <>
            <div className={cn(className, styles.inputWrapper, "relative", {
                [styles.l]: size === "l",
                [styles.m]: size === "m",
                [styles.s]: size === "s",
            }
            )}>
                {icon &&
                    <div className={cn("absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
                        {
                            [styles.big]: sizeOfIcon === "big",
                            [styles.normal]: sizeOfIcon === "normal",
                        })}>
                        {icon}
                    </div>
                }
                <input
                    ref={innerRef}
                    className={cn(
                        styles.input,
                        {
                            "text-center": textAlign === "center",
                            "text-left": textAlign === "left",
                            [styles.bigInput]: sizeOfIcon === "big",
                            [styles.normalInput]: sizeOfIcon === "normal",
                        },
                        "focus:ring-4 focus:ring-violet-200"
                    )} value={value} placeholder={placeholder} readOnly={readOnly} {...props} />
            </div>
        </>
    );
};