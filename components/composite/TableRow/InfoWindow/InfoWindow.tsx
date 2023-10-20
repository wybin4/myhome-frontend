import { InfoWindowProps } from "./InfoWindow.props";
import cn from "classnames";
import styles from "./InfoWindow.module.css";
import CloseIcon from "../icons/close.svg";
import { Tag } from "@/components";
import { useEffect, useRef } from "react";

export const InfoWindow = ({
    title, description, text, tags,
    isOpen, setIsOpen, ...props
}: InfoWindowProps): JSX.Element => {
    const windowRef = useRef(null);

    const closeFiltersOnOutsideClick = (e: MouseEvent) => {
        let targetClass;
        const target = e.target as HTMLElement | null;
        if (target) {
            if (!target.classList.contains("viewAction")) {
                const parent = target.parentElement;
                if (parent && parent.classList.contains("viewAction")) {
                    targetClass = parent.className;
                } else if (parent && parent.parentElement && parent.parentElement.classList.contains("viewAction")) {
                    targetClass = parent.parentElement.className;
                }
            } else {
                targetClass = target.className;
            }
        }


        if (
            windowRef.current &&
            !(windowRef.current as Node).contains(e.target as Node)
            && targetClass !== "viewAction"
        ) {
            setIsOpen(false);
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
            <div {...props} className={cn(
                styles.wrapper,
                { [styles.hidden]: !isOpen }
            )} ref={windowRef}>
                <div className={styles.closeIcon}
                    onClick={() => setIsOpen(!isOpen)}>
                    <CloseIcon />
                </div>
                <div className={styles.titleWrapper}>
                    <p className={styles.mainTitle}>{title}</p>
                    <p className={styles.description}>{description}</p>
                </div>
                {tags && <div className={styles.tags}>
                    {tags.map((tag, index) =>
                        <Tag size="l" key={index}>{tag}</Tag>
                    )}
                </div>}
                <div className={styles.text}>
                    {text}
                </div>
            </div>
        </>
    );
};