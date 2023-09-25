import { FormProps } from "./Form.props";
import styles from "./Form.module.css";
import cn from "classnames";
import React from "react";
import { Button, Paragraph } from "@/components";

export const Form = ({
    title, children,
    className,
    isOpened, setIsOpened,
    ...props
}: FormProps): JSX.Element => {
    return (
        <div className={cn(className, styles.wrapper, {
            "hidden": !isOpened,
        })} {...props}>
            <Paragraph size="l" className={styles.title}>{title}</Paragraph>
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.buttonWrapper}>
                <Button appearance="ghost" size="m" onClick={() => setIsOpened && setIsOpened(!isOpened)}>Отмена</Button>
                <Button appearance="primary" size="m">Добавить</Button>
            </div>
        </div>
    );
};