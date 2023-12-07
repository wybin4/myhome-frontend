import { forwardRef, ForwardedRef, useState } from "react";
import { InputVoteProps } from "./InputVote.props";
import cn from "classnames";
import styles from "./InputVote.module.css";

export const InputVote = forwardRef(({
    title, setValue,
    className,
    inputError,
    ...props
}: InputVoteProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
    const [internalValues, setInternalValues] = useState<string[]>(["", ""]);

    const handleInput = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = event.target.value;
            return newValues;
        });
        setValue && setValue([...internalValues]);
    };

    const addValue = () => {
        if (internalValues.length < 5) {
            setInternalValues((prevValues) => [...prevValues, ""]);
            setValue && setValue([...internalValues, ""]);
        }
    };

    return (
        <>
            <div className={cn(className, styles.wrapper, {
                [styles.inputError]: inputError
            })} ref={ref} {...props}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.inputsWrapper}>
                    {internalValues.map((v, i) => (
                        <input
                            key={i}
                            autoComplete="off"
                            ref={ref}
                            className={cn(
                                styles.input,
                                {
                                    "focus:ring-4 focus:ring-violet-200": !inputError,
                                    "focus:ring-4 focus:ring-red-200": inputError,
                                },
                            )} value={v}
                            onChange={(event) => handleInput(i, event)}
                        />
                    ))}
                </div>
                <button
                    className={styles.addOptionButton}
                    onClick={addValue}
                    type="button"
                >
                    Добавить вариант</button>
                {inputError && <div className={styles.error}>{inputError}</div>}
            </div>
        </>
    );
});
