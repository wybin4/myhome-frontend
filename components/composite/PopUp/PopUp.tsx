import { CopyProps, PopUpProps } from "./PopUp.props";
import styles from "./PopUp.module.css";
import cn from 'classnames';
import { Htag, Icon, Paragraph } from "@/components";
import SuccessIcon from './success.svg';
import FailureIcon from './failure.svg';
import CopyIcon from './copy.svg';
import { useEffect } from "react";

export const PopUp = ({
    link, type,
    isOpen, setIsOpen,
    className, children, popupRef, ...props
}: PopUpProps): JSX.Element => {
    const closeFiltersOnOutsideClick = (e: MouseEvent) => {
        if (popupRef) {
            if (popupRef.current && !(popupRef.current as Node).contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeFiltersOnOutsideClick);
        return () => {
            document.removeEventListener("click", closeFiltersOnOutsideClick);
        };
    }, []);

    return (
        <>
            {isOpen &&
                <div className={cn(styles.popup, className, {
                    [styles.success]: type === "success",
                    [styles.failure]: type === "failure",
                    [styles.linkFailure]: type === "link-failure",
                })} ref={popupRef} {...props}>
                    <div className="relative">
                        <Icon type="icon" appearance={type === "success" ? "green" : "red"} size="l" className={styles.logoIcon}>
                            {type === "success" && <SuccessIcon />}
                            {type === "failure" && <FailureIcon />}
                            {type === "link-failure" && <FailureIcon />}
                        </Icon>
                        <Icon type="icon" appearance="red" size="xs" className={styles.logoIconLittle}>
                            {type === "link-failure" && <FailureIcon />}
                        </Icon>
                    </div>
                    <div className={styles.textBlock}>
                        <Htag size="h3" className={styles.title}>
                            {type === "success" && <>Отлично!</>}
                            {type === "failure" && <>Упс!</>}
                            {type === "link-failure" && <>Упс!</>}
                        </Htag>
                        <Paragraph size="s" className={styles.text}>{children}</Paragraph>
                        {type === "link-failure" &&
                            <Copy setIsOpen={setIsOpen} link={link ? link : "#"} />
                        }
                    </div>
                </div>
            }
        </>
    );
};

const Copy = ({ link, setIsOpen, ...props }: CopyProps) => {
    return (
        <>
            <div {...props} className={styles.copyWrapper}>
                <div className={styles.input}>
                    {link}
                </div>
                <button className={styles.copyButton}
                    onMouseDown={async () => {
                        await navigator.clipboard.writeText(link);
                        setIsOpen(false);
                    }}>
                    <CopyIcon />
                </button>
            </div>
        </>
    );
};