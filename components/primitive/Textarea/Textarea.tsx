import { TextareaProps } from "./Textarea.props";
import styles from "./Textarea.module.css";
import cn from 'classnames';
import { ForwardedRef, forwardRef } from "react";

export const Textarea = forwardRef(({
    title, placeholder,
    text, setText,
    className,
    textareaError,
    ...props
}: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>): JSX.Element => {

    return (
        <>
            <div className={cn(className, styles.textareaWrapper, {
                [styles.textareaError]: textareaError
            })}>
                {title && <div className={styles.textareaTitle}>{title}</div>}
                <textarea
                    autoComplete="off"
                    ref={ref}
                    className={cn(
                        styles.textarea,
                        {
                            "focus:ring-4 focus:ring-violet-200": !textareaError,
                            "focus:ring-4 focus:ring-red-200": textareaError
                        },
                    )}
                    value={text ? text : ""} onChange={(event) => setText && setText(event.target.value)}
                    placeholder={placeholder} {...props} />
                {textareaError && <span className={styles.textareaError}>{textareaError}</span>}
            </div>
        </>
    );
});