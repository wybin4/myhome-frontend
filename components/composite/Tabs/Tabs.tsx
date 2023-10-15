import { TabsProps } from "./Tabs.props";
import styles from "./Tabs.module.css";
import cn from 'classnames';
import { Button, Htag, Tag } from "@/components";

export const Tabs = ({
    title,
    tabs,
    tagTexts, descriptionText,
    onAddButtonClick,
    activeTab, setActiveTab,
    className, children, ...props
}: TabsProps): JSX.Element => {
    return (
        <>
            <Htag size="h1" className="mb-[3rem] lg:mb-[2rem] md:mb-[2rem] sm:mb-[2rem]">{title}</Htag>
            <div className={styles.tabs}>
                {tabs && tabs.map(tab => (
                    <div
                        key={tab.name}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(styles.tab, {
                            [styles.activeTab]: activeTab === tab.id
                        })}
                    >
                        {tab.name}
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
                        {onAddButtonClick &&
                            <Button
                                appearance="primary"
                                symbol="add"
                                typeOfButton="rounded"
                                size="s"
                                onClick={onAddButtonClick}
                            >Добавить счётчик</Button>
                        }
                    </div>
                </div>
                <div className={cn(styles.content, className)}>
                    {children}
                </div>
            </div>
        </>
    );
};