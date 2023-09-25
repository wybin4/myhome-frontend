import { TabsProps } from "./Tabs.props";
import styles from "./Tabs.module.css";
import cn from 'classnames';
import { Button, Tag } from "@/components";

export const Tabs = ({
    tabNames,
    tagTexts, descriptionText,
    onAddButtonClick,
    activeTab, setActiveTab,
    className, children, ...props
}: TabsProps): JSX.Element => {
    return (
        <>
                <div className={styles.tabs}>
                    {tabNames && tabNames.map((name, index) => (
                        <div
                            key={name}
                            onClick={() => setActiveTab(index)}
                            className={cn(styles.tab, {
                                [styles.activeTab]: activeTab === index
                            })}
                        >
                            {name}
                        </div>
                    ))}
                </div>
                <div className={styles.wrapper} {...props}>
                    <div className={styles.topOfWrapper}>
                        <div>
                            {tagTexts &&
                                <div className={styles.tagTexts}>
                                    {tagTexts.map((tag, key) => <Tag size="l" key={key}>{tag}</Tag>)}
                                </div>
                            }
                            {descriptionText && <div className={styles.description}>{descriptionText}</div>}
                        </div>
                        <div className={styles.buttonWrapper}>
                            {onAddButtonClick && <Button
                                appearance="primary"
                                symbol="add"
                                typeOfButton="rounded"
                                size="s"
                                onClick={onAddButtonClick}
                            >Добавить счётчик</Button>}
                        </div>
                    </div>
                    <div className={cn(styles.content, className)}>
                        {children}
                    </div>
                </div>
        </>
    );
};