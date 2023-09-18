import { InputProps } from "./Input.props";
import styles from "./Input.module.css";
import cn from 'classnames';

export const Input = ({
    value,
    icon, sizeOfIcon = "normal",
    placeholder, className, size,
    readOnly = false,
    ...props
}: InputProps): JSX.Element => {
    return (
        <>
            <span className={cn(className, styles.inputWrapper, "relative", {
                [styles.l]: size === "l",
                [styles.s]: size === "s",
            }
            )}>
                <div className={cn("absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
                    {
                        [styles.big]: sizeOfIcon === "big",
                        [styles.normal]: sizeOfIcon === "normal",
                    })}>
                    {icon}
                </div>
                <input className={cn(
                    styles.input,
                    {
                        [styles.bigInput]: sizeOfIcon === "big",
                        [styles.normalInput]: sizeOfIcon === "normal",
                    },
                    "focus:ring-4 focus:ring-violet-200"
                )} value={value} placeholder={placeholder} readOnly={readOnly} {...props} />
            </span>
        </>
    );
};