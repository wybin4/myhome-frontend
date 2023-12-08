import { CardBottomProps, CardInputProps, CardProps, CardTitleProps, ChargeCardBottomProps, ChargeCardProps, ChargeCardTitleProps } from "./Card.props";
import styles from "./Card.module.css";
import cn from "classnames";
import { Button, Icon, Input, Paragraph, Tag, Voting } from "@/components";
import React, { useRef, useState } from "react";
import AttachmentIcon from "./attachment.svg";
import SwapIcon from "./swap.svg";

export const Card = ({
    titlePart, description,
    text, isMobileText = true,
    input, bottom, voting,
    maxWidth, width, inputValue, setInputValue,
    className, ...props
}: CardProps): JSX.Element => {

    return (
        <div
            style={{
                maxWidth: maxWidth ? maxWidth : "100%",
                width: width ? width : "100%"
            }}
            className={cn(styles.cardWrapper, className)}
            {...props}>
            <CardTitle  {...titlePart} />
            {description && <Paragraph size="xs" className={styles.description}>{description}</Paragraph>}
            {input && <CardInput className={styles.input} {...input} value={inputValue} setValue={setInputValue} />}
            {voting && <Voting {...voting} />}
            {text && <p className={cn("my-4", {
                "md:hidden sm:hidden": !isMobileText
            })}>{text}</p>}
            {bottom && <CardBottom {...bottom} />}
        </div>
    );
};

export const CardTitle = ({
    text, description,
    iconLeft, iconLeftSize = "s", iconLeftVisible = true,
    tag,
    symbolRight,
    ...props }: CardTitleProps): JSX.Element => {

    return (
        <div className={styles.title} {...props}>
            <div className={styles.titleWrapper}>
                {tag && <Icon fillType="stroke" type="icon" appearance="primary" className={styles.tagIcon} size="s">
                    {tag.tagIcon}
                </Icon>}
                {iconLeft && <Icon className={cn(styles.iconLeft, {
                    [styles.iconLeftInvisible]: !iconLeftVisible,
                })} size={iconLeftSize} type="icon" appearance="primary">
                    {iconLeft}
                </Icon>}
                <div className={cn({
                    [styles.titleWithIcon]: iconLeftVisible,
                    [styles.titleWithoutIcon]: !iconLeftVisible
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
                    >
                        {symbolRight.symbol}
                    </span>
                }
            </div>
            {tag &&
                <Tag
                    size="l"
                    className={cn("md:!hidden sm:!hidden", {
                        [styles.tagSwap]: tag.swap
                    })}
                    onClick={tag.onSwapClick}
                >
                    {tag.tag}
                    {tag.swap && <span className={styles.swapIcon}>
                        <SwapIcon />
                    </span>}
                </Tag>
            }
        </div>
    );
};

export const CardInput = ({
    readOnly = false, title,
    value = "", setValue,
    textAlign = "left", placeholder,
    button, inputType = "string",
    ...props
}: CardInputProps): JSX.Element => {
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <div {...props}>
            <Paragraph size="xs" className="font-medium mb-[0.5625rem]">{title}</Paragraph>
            <Input
                inputType={inputType}
                value={value} setValue={setValue}
                placeholder={placeholder ? placeholder : ""}
                size="m" textAlign={textAlign}
                readOnly={readOnly}
                onFocus={() => !readOnly && setIsInputFocused(true)}
                inputError={button?.error}
            />
            {isInputFocused && button && !button.isReady && <button
                className={styles.addButton}
                onClick={button.onClick}
                ref={buttonRef}
            >
                {button.text}
            </button>}
        </div>
    );
};

export const CardBottom = ({
    text, textAlign = "left",
    tag, onClick,
    attachment, isBottom = true,
    ...props
}: CardBottomProps): JSX.Element => {
    return (
        <div className={cn(styles.bottom, {
            [styles.mobileWithoutAttachment]: !isBottom
        })}>
            {text &&
                <Paragraph size="xs" className={cn(styles.bottomText, {
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
                    <p className={styles.attachment} onClick={onClick}>
                        <span className="md:hidden sm:hidden"><AttachmentIcon /></span>
                        {attachment}
                    </p>
                }
            </div>
        </div>
    );
};

export const ChargeCard = ({
    titlePart, text,
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
            {text}
            {bottom && <ChargeCardBottom {...bottom} />}
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
                {tag && <Icon
                    className={cn("viewAction", styles.tagIcon)}
                    size="s" type="icon"
                    fillType="stroke"
                >
                    {tag.tagIcon}
                </Icon>}
                <div className={styles.titleMainWrapper}>
                    <p className={cn(styles.titleText, "viewAction")}>{text}</p>
                    {description &&
                        <p className={cn(styles.titleDesc, "text-[0.77rem] viewAction")}>
                            {description}
                        </p>}
                </div>
            </div>
            <div className={cn(
                styles.textRight,
                "viewAction hidden md:block sm:block"
            )}>{textRight}</div>
        </div>
    );
};

export const ChargeCardBottom = ({
    text, button,
    ...props
}: ChargeCardBottomProps): JSX.Element => {
    return (
        <div className={cn(styles.bottom, "viewAction")}>
            {text &&
                <Paragraph size="xs" className={cn(
                    styles.bottomText, "viewAction",
                    "hidden md:block sm:block"
                )} {...props}>
                    {text}
                </Paragraph>
            }
            {button &&
                <Button
                    appearance="primary" size="l"
                    onClick={button.onClick}
                >
                    {button.name}
                </Button>
            }
        </div>
    );
};