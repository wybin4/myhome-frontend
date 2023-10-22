import { CardBottomProps, CardInputProps, CardProps, CardTitleProps } from "./Card.props";
import styles from "./Card.module.css";
import cn from "classnames";
import { Input, Paragraph, Tag, Voting } from "@/components";
import React, { useState } from "react";
import AttachmentIcon from "./attachment.svg";

export const Card = ({
    titlePart, description, text,
    input, bottom, voting,
    maxWidth,
    className, ...props
}: CardProps): JSX.Element => {
    const [inputValue, setInputValue] = useState<string | number | undefined>(input?.value);

    return (
        <div
            style={{ maxWidth: maxWidth ? maxWidth : "100%" }}
            className={cn(styles.cardWrapper, className)}
            {...props}>
            <CardTitle  {...titlePart} />
            <Paragraph size="xs" className={styles.description}>{description}</Paragraph>
            {input && <CardInput className={styles.input} {...input} value={inputValue} setValue={setInputValue} />}
            {voting && <Voting {...voting} />}
            {text && <p>{text}</p>}
            {bottom && <CardBottom {...bottom} />}
        </div>
    );
};

export const CardTitle = ({
    text, description,
    iconLeft, iconLeftSize = "s",
    tag, symbolRight,
    ...props }: CardTitleProps): JSX.Element => {
    return (
        <div className={styles.title} {...props}>
            <div className={styles.titleWrapper}>
                <span className={cn(styles.iconLeft, {
                    [styles.iconLeftL]: iconLeftSize === "l",
                    [styles.iconLeftS]: iconLeftSize === "s",
                })}>{iconLeft}</span>
                <div className={cn({
                    [styles.titleWithLeftLIcon]: iconLeftSize === "l"
                })}>
                    <Paragraph size="m" className="font-medium">{text}</Paragraph>
                    {description && <Paragraph size="xs" className={styles.titleDesc}>{description}</Paragraph>}
                </div>
                <span className={styles.symbolRight}>{symbolRight}</span>
            </div>
            {tag && <Tag size="l">{tag}</Tag>}
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
            <div className={styles.bottomTagAtt}>
                {tag && <Tag size="l" className={styles.bottomTag}>{tag}</Tag>}
                {attachment &&
                    <p className={styles.attachment}>
                        <AttachmentIcon />
                        {attachment}
                    </p>
                }
            </div>
        </div>
    );
};
