import { TabsProps } from "./Tabs.props";
import styles from "./Tabs.module.css";
import cn from 'classnames';
import { Button, Htag, TableButton, Tag } from "@/components";

export const Tabs = ({
    title,
    tabs,
    tagTexts, descriptionText,
    addButtonText, onAddButtonClick,
    activeTab, setActiveTab, isData,
    className, children, ...props
}: TabsProps): JSX.Element => {
    return (
        <>
            {!isData && onAddButtonClick &&
                <TableButton
                    buttons={[{
                        type: "add",
                        title: `Добавить ${{ addButtonText }}`,
                        appearance: "primary",
                        onClick: onAddButtonClick
                    }]}
                    isFiltersExist={false}
                    isFilterOpened={false}
                    setIsFilterOpened={() => { }}
                />
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
                            {onAddButtonClick &&
                                <div className={styles.buttonWrapper}>
                                    <Button
                                        appearance="primary"
                                        symbol="add"
                                        typeOfButton="rounded"
                                        size="s"
                                        onClick={onAddButtonClick}
                                    >Добавить {addButtonText}</Button>
                                </div>
                            }
                        </div>
                        <div className={cn(styles.content, className)}>
                            {children}
                        </div>
                    </div>
                </>
            }
        </>
    );
};