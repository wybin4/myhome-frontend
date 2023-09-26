import { CheckboxProps } from "./Checkbox.props";
import styles from "./Checkbox.module.css";
import { useState } from "react";
import CheckIcon from "./check.svg";
import cn from "classnames";

export const Checkbox = ({ forString, children, ...props }: CheckboxProps): JSX.Element => {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };
    return (
        <div className="inline-flex items-center">
            <label
                className="relative flex cursor-pointer items-center"
                htmlFor={`checkbox_${forString}`}
                data-ripple-dark="true"
            >
                <input
                    id={`checkbox_${forString}`}
                    type="checkbox"
                    className={cn(
                        styles.checkbox,
                        "transition-all",
                        "before:content[''] before:absolute before:block before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10",
                        "before:top-2/4 before:left-2/4 before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4",
                        "peer relative appearance-none rounded-[0.3125rem]"
                    )}
                    onChange={handleChange}
                    {...props}
                />
                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <CheckIcon className={styles.checkIcon} />
                </div>
            </label>
            <label
                className={cn(styles.checkboxLabel, "ml-2 cursor-pointer select-none")}
                htmlFor={`checkbox_${forString}`}
            >
                {children}
            </label>
        </div>
    );
};