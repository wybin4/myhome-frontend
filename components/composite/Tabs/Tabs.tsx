import { TabsProps } from "./Tabs.props";
import styles from "./Tabs.module.css";
import cn from 'classnames';
import { Button, Htag, Tag } from "@/components";

export const Tabs = ({
    title,
    tabs,
    tagTexts, descriptionText,
    onAddButtonClick,
    activeTab, setActiveTab, isData,
    className, children, ...props
}: TabsProps): JSX.Element => {

    return (
        <>
            {!isData && onAddButtonClick &&
                <Button
                    appearance="primary"
                    symbol="add"
                    typeOfButton="ordinary"
                    size="m"
                    onClick={onAddButtonClick}
                >Добавить</Button>
            }
            {isData &&
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
                    <div className={cn(styles.wrapper, {
                        "flex flex-row-reverse justify-between": !tagTexts,
                        "lg:!block md:!block sm:!block": !tagTexts
                    })} {...props}>
                        <div className={cn(styles.topOfWrapper, {
                            "!block": !tagTexts
                        })}>
                            {tagTexts &&
                                <div>
                                    <div className={styles.tagTexts}>
                                        {tagTexts.map((tag, key) => <Tag size="l" key={key}>{tag}</Tag>)}
                                    </div>
                                    {descriptionText && <div className={styles.description}>{descriptionText}</div>}
                                </div>
                            }
                            {onAddButtonClick &&
                                <div className={styles.buttonWrapper}>
                                    <Button
                                        appearance="primary"
                                        symbol="add"
                                        typeOfButton="rounded"
                                        size="s"
                                        onClick={onAddButtonClick}
                                    >Добавить</Button>
                                </div>
                            }
                        </div>
                        <div className={cn(styles.content, className, {
                            "!mt-2": !tagTexts,
                            "lg:!mt-6 md:!mt-6 sm:!mt-6": !tagTexts
                        })}>
                            {children}
                        </div>
                    </div>
                </>
            }
        </>
    );
};