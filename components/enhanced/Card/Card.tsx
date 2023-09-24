import { CardBottomProps, CardInputProps, CardProps, CardTitleProps } from "./Card.props";
import styles from "./Card.module.css";
import cn from "classnames";
import { Input, Paragraph } from "@/components";
import React, { useState } from "react";

export const Card = ({
    titlePart, description, text,
    input, bottom,
    className, ...props
}: CardProps): JSX.Element => {
    const [inputValue, setInputValue] = useState<string | undefined>(input?.value);

    return (
        <div
            className={cn(styles.cardWrapper, className)}
            {...props}>
            <CardTitle className={styles.title} {...titlePart} />
            <Paragraph size="xs" className={styles.description}>{description}</Paragraph>
            {input && <CardInput className={styles.input} {...input} value={inputValue} setValue={setInputValue} />}
            {bottom && <CardBottom {...bottom} />}
        </div>
    );
};

export const CardTitle = ({ text, iconLeft, tag, symbolRight, ...props }: CardTitleProps): JSX.Element => {
    return (
        <div {...props}>
            <span className={styles.iconLeft}>{iconLeft}</span>
            <Paragraph size="m" className="font-medium">{text}</Paragraph>
            <span className={styles.symbolRight}>{symbolRight}</span>
        </div>
    );
};

export const CardInput = ({ readOnly = false, title, value = "", setValue, textAlign = "left", placeholder, ...props }: CardInputProps): JSX.Element => {
    return (
        <div {...props}>
            <Paragraph size="xs" className="font-medium mb-[0.5625rem]">{title}</Paragraph>
            <Input
                value={value} setValue={setValue}
                placeholder={placeholder ? placeholder : ""}
                size="m" textAlign={textAlign}
                readOnly={readOnly}
            />
        </div>
    );
};

export const CardBottom = ({ text, textAlign = "left", tag, attachment, ...props }: CardBottomProps): JSX.Element => {
    return (
        <div>
            {text &&
                <Paragraph size="xs" className={cn(styles.bottomText, {
                    "text-center": textAlign === "center"
                })} {...props}>
                    {text}
                </Paragraph>
            }
        </div>
    );
};
