import { CardBottomProps, CardInputProps, CardProps, CardTitleProps, ChargeCardProps, ChargeCardTitleProps } from "./Card.props";
import styles from "./Card.module.css";
import cn from "classnames";
import { Input, Paragraph, Tag, Voting } from "@/components";
import React, { useState } from "react";
import AttachmentIcon from "./attachment.svg";

export const Card = ({
    titlePart, description,
    text, isMobileText = true,
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
            {description && <Paragraph size="xs" className={styles.description}>{description}</Paragraph>}
            {input && <CardInput className={styles.input} {...input} value={inputValue} setValue={setInputValue} />}
            {voting && <Voting {...voting} />}
            {text && <p className={cn({
                "md:hidden sm:hidden": !isMobileText
            })}>{text}</p>}
            {bottom && <CardBottom {...bottom} />}
        </div>
    );
};

export const CardTitle = ({
    text, description,
    iconLeft, iconLeftSize = "s",
    tag,
    symbolRight,
    ...props }: CardTitleProps): JSX.Element => {
    return (
        <div className={styles.title} {...props}>
            <div className={styles.titleWrapper}>
                {tag && <span className={styles.tagIcon}>{tag.tagIcon}</span>}
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
                {
                    symbolRight && <span
                        className={cn(styles.symbolRight, {
                            [styles.symbolRightL]: symbolRight.size === "l",
                            [styles.symbolRightS]: symbolRight.size === "s",
                        })}
                        onClick={symbolRight.onClick}
                    >{symbolRight.symbol}</span>
                }
            </div>
            {tag && <Tag size="l" className="md:!hidden sm:!hidden">{tag.tag}</Tag>}
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
        <div className={cn(styles.bottom, "viewAction")}>
            {text &&
                <Paragraph size="xs" className={cn(styles.bottomText, "viewAction", {
                    "text-center": textAlign === "center"
                })} {...props}>
                    {text}
                </Paragraph>
            }
            <div className={styles.bottomTagAtt}>
                {tag && <Tag size="l" className={cn(
                    styles.bottomTag,
                    "md:!hidden sm:!hidden"
                )}>{tag}</Tag>}
                {attachment &&
                    <p className={styles.attachment}>
                        <span className="md:hidden sm:hidden"><AttachmentIcon /></span>
                        {attachment}
                    </p>
                }
            </div>
        </div>
    );
};

export const ChargeCard = ({
    titlePart,
    bottom,
    maxWidth,
    className, ...props
}: ChargeCardProps): JSX.Element => {
    return (
        <div
            style={{ maxWidth: maxWidth ? maxWidth : "100%" }}
            className={cn(
                "viewAction",
                styles.cardWrapper,
                styles.chargeCard,
                className)}
            {...props}>
            <ChargeCardTitle  {...titlePart} />
            {bottom && <CardBottom {...bottom} />}
        </div>
    );
};

export const ChargeCardTitle = ({
    text, description,
    tag,
    textRight,
    ...props
}: ChargeCardTitleProps): JSX.Element => {
    return (
        <div className={cn(styles.title, "gap-2", "viewAction")} {...props}>
            <div className={cn(styles.titleWrapper, "viewAction")}>
                {tag && <span className={cn(styles.tagIcon, "viewAction")}>{tag.tagIcon}</span>}
                <div>
                    <p className="font-medium text-[0.92rem] viewAction">{text}</p>
                    {description &&
                        <p className={cn(styles.titleDesc, "text-[0.77rem] viewAction")}>
                            {description}
                        </p>}
                </div>
            </div>
            <div className={cn(styles.textRight, "viewAction")}>{textRight}</div>
        </div>
    );
};