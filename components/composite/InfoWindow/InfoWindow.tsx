import { InfoWindowProps } from "./InfoWindow.props";
import cn from "classnames";
import styles from "./InfoWindow.module.css";
import CloseIcon from "./close.svg";
import { Button, Icon, Tag } from "@/components";
import { useEffect, useRef } from "react";

export const InfoWindow = ({
    title, description, text, icon, tags, buttons,
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
            && !(targetClass && targetClass?.split(" ")?.includes("viewAction"))
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
                    {icon &&
                        <Icon size="m" type="icon" fillType="stroke"
                            className="mb-[1.46rem]">
                            {icon}
                        </Icon>}
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
                {buttons && buttons.length !== 0 && <div className={styles.buttons}>
                    {
                        buttons.map((button, key) =>
                            <Button
                                onClick={button.onClick}
                                key={key}
                                appearance="primary"
                                size="m"
                            >{button.name}</Button>
                        )
                    }
                </div>}
            </div>
        </>
    );
};