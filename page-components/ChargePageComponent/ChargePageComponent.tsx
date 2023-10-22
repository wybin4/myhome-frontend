import { InfoWindow, Tabs, ChargeCard } from "@/components";
import { ChargePageComponentProps, ChargeTextProps } from "./ChargePageComponent.props";
import MoneyIcon from "./money.svg";
import DownloadIcon from "./download.svg";
import styles from "./ChargePageComponent.module.css";
import cn from "classnames";

export const ChargePageComponent = ({
    activeTab, setActiveTab,
    isInfoWindowOpen, setIsInfoWindowOpen
}: ChargePageComponentProps): JSX.Element => {
    return (
        <>
            <InfoWindow
                title="пер. Соборный 99, кв. 11"
                description="ТСЖ Прогресс | Февраль 2023"
                text={
                    <ChargeText
                        total="2 703,70"
                        amount="2 612,18"
                        debt="91,52"
                        date="февраль 2023"
                        downloadUrl="https://www.youtube.com/watch?v=xchCnyDyvVw"
                    />
                }
                isOpen={isInfoWindowOpen}
                setIsOpen={setIsInfoWindowOpen}
                buttons={[{ name: "Оплатить", onClick: () => { } }]}
                icon={<MoneyIcon />}
            />
            <Tabs
                title="Начисления"
                tabs={[
                    { id: 1, name: "Оплата" },
                    { id: 2, name: "Графики" },
                    { id: 3, name: "Квитанции" },
                ]}
                activeTab={activeTab} setActiveTab={setActiveTab}
            >
                {activeTab === 1 &&
                    <ChargeCard
                        titlePart={{
                            text: "пер. Соборный 99, кв. 11",
                            description: "ТСЖ Прогресс",
                            tag: {
                                tag: "Оплатить",
                                tagIcon: <MoneyIcon />
                            },
                            textRight: "2703,70₽"
                        }}

                        bottom={{ text: "Февраль 2023" }}
                        onClick={() => setIsInfoWindowOpen(!isInfoWindowOpen)}
                    />
                }
                {activeTab === 2 &&
                    <div>Графики</div>
                }
                {activeTab === 3 &&
                    <div>Квитанции</div>
                }
            </Tabs>
        </>
    );
};

const ChargeText = ({
    total, amount, debt,
    date, downloadUrl, ...props
}: ChargeTextProps): JSX.Element => {
    return (
        <div className={styles.textWrapper} {...props}>
            <div className={cn(styles.chargeText, styles.mediumText)}>
                <span>Общая сумма</span>
                <span>{total}₽</span>
            </div>
            <div className={styles.chargeText}>
                <span>Задолженность:</span>
                <span>{debt}</span>
            </div>
            <div className={styles.chargeText}>
                <span>Начислено:</span>
                <span>{amount}</span>
            </div>
            <div className={styles.chargeText}>
                <span>Задолженность на конец:</span>
                <span>{total}</span>
            </div>
            <div className={cn(styles.chargeText, styles.downloadText)}>
                <span>Квитанция за {date}</span>
                <span
                    className={styles.download}
                    onClick={() => {
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = String(Date.now());
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(downloadUrl);
                    }}
                ><DownloadIcon /></span>
            </div>
        </div>
    );
};