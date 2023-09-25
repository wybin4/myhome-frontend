import { FormProps } from "./Form.props";
import styles from "./Form.module.css";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Button, Paragraph } from "@/components";

export const Form = ({
    title, children,
    className,
    isOpened, setIsOpened,
    ...props
}: FormProps): JSX.Element => {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        if (isOpened) {
            setIsFormVisible(true);
        } else {
            setIsFormVisible(false);
        }
    }, [isOpened]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node | null)) {
                setIsOpened && setIsOpened(false);
            }
        };

        if (isFormVisible) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isFormVisible]);

    return (
        <div className={cn(className, styles.wrapper, {
            "hidden": !isOpened,
        })} {...props} ref={formRef}>
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