import { InfoWindow, Tabs, ChargeCard, Table, Histogram } from "@/components";
import { ChargePageComponentProps, ChargeTextProps } from "./ChargePageComponent.props";
import MoneyIcon from "./money.svg";
import DownloadIcon from "./download.svg";
import styles from "./ChargePageComponent.module.css";
import cn from "classnames";
import PdfIcon from "./pdf.svg";
import { monthNamesInNominativeCase, bytesToSize, downloadPdf } from "@/helpers/constants";
import { MouseEventHandler } from "react";

export const ChargePageComponent = ({
    activeTab, setActiveTab,
    isInfoWindowOpen, setIsInfoWindowOpen,
    singlePaymentDocuments
}: ChargePageComponentProps): JSX.Element => {
    const chargeCard = {
        total: "2 703,70",
        amount: "2 612,18",
        debt: "91,52",
        date: "февраль 2023",
        downloadUrl: "https://www.youtube.com/watch?v=xchCnyDyvVw"
    };

    const lastCharges = [
        {
            data: [
                {
                    date: '2023.11.10',
                    total: 5840.32
                }, {
                    date: '2023.10.10',
                    total: 5150
                }, {
                    date: '2023.09.10',
                    total: 6532
                }, {
                    date: '2023.08.10',
                    total: 5455
                }, {
                    date: '2023.07.10',
                    total: 6001.2
                },
                {
                    date: '2023.06.10',
                    total: 5001.2
                },
            ],
            label: "пер. Соборный 99, кв. 12"
        },
        {
            data: [
                {
                    date: '2023.11.10',
                    total: 2830.32
                }, {
                    date: '2023.10.10',
                    total: 3150
                }, {
                    date: '2023.09.10',
                    total: 2733
                }, {
                    date: '2023.08.10',
                    total: 2415
                }, {
                    date: '2023.07.10',
                    total: 3001.2
                },
                {
                    date: '2023.06.10',
                    total: 2001.2
                },
            ],
            label: "ул. Малюгина 35, кв. 124"
        }
    ];

    type SPDData = {
        apartmentNames: string[],
        spdNames: string[];
        spdIds: number[];
        fileSizes: string[];
    };

    const initialData: SPDData = {
        apartmentNames: [],
        spdNames: [],
        spdIds: [],
        fileSizes: [],
    };

    const spds: SPDData = singlePaymentDocuments.reduce(
        (accumulator, spd) => {
            accumulator.apartmentNames.push(spd.apartmentName);

            const date = new Date(spd.createdAt);
            const monthNumber = date.getMonth();
            const year = date.getFullYear();

            accumulator.spdNames.push(
                `${monthNamesInNominativeCase[monthNumber]} ${year}`
            );

            accumulator.spdIds.push(spd.id);

            const fileSize = bytesToSize(spd.fileSize);
            accumulator.fileSizes.push(fileSize);

            return accumulator;
        },
        initialData
    );

    const {
        apartmentNames,
        spdNames,
        spdIds,
        fileSizes
    } = spds;

    const download: MouseEventHandler<HTMLDivElement> = (event) => {
        const spd = singlePaymentDocuments.find(s => s.id === Number(event.currentTarget.id));
        if (spd && spd.pdfBuffer) {
            downloadPdf(spd.pdfBuffer, String(spd.createdAt));
        }
    };

    return (
        <>
            <InfoWindow
                title="пер. Соборный 99, кв. 11"
                description="ТСЖ Прогресс | Февраль 2023"
                text={
                    <ChargeText
                        {...chargeCard}
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
                        maxWidth="26.19rem"
                        titlePart={{
                            text: "пер. Соборный 99, кв. 11",
                            description: "ТСЖ Прогресс",
                            tag: {
                                tag: "Оплатить",
                                tagIcon: <MoneyIcon />
                            },
                            textRight: "2703,70₽"
                        }}
                        text={
                            <ChargeText
                                className="md:hidden sm:hidden"
                                {...chargeCard}
                            />}
                        bottom={{
                            text: "Февраль 2023",
                            button: {
                                name: "Оплатить",
                                onClick: () => { }
                            }
                        }}
                        onClick={() => {
                            if (window.innerWidth <= 600) {
                                setIsInfoWindowOpen(!isInfoWindowOpen);
                            }
                        }}
                    />
                }
                {activeTab === 2 &&
                    <Histogram data={lastCharges} />
                }
                {activeTab === 3 &&
                    <div>
                        <Table title="" rows={{
                            startIcon: <PdfIcon />,
                            actions: {
                                actions: [{
                                    type: "download",
                                    onClick: download,
                                    id: 0
                                }]
                            },
                            ids: spdIds,
                            items: [
                                {
                                    title: "Квитанция",
                                    type: "text",
                                    items: spdNames
                                },
                                {
                                    title: "Квартира",
                                    type: "text",
                                    items: apartmentNames
                                },
                                {
                                    title: "Размер",
                                    type: "text",
                                    items: fileSizes
                                }
                            ],
                            keyElements: { first: [3], second: 1, isSecondNoNeedTitle: true }
                        }} />
                    </div>
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
        <div className={cn(styles.textWrapper)} {...props}>
            <div className={cn(styles.chargeText, styles.mediumText)}>
                <span className="hidden md:block sm:block">Общая сумма</span>
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