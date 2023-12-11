import { InfoWindow, Tabs, ChargeCard, Table, Histogram, Htag } from "@/components";
import { ChargePageComponentProps, ChargeTextProps } from "./ChargePageComponent.props";
import MoneyIcon from "./money.svg";
import DownloadIcon from "./download.svg";
import styles from "./ChargePageComponent.module.css";
import cn from "classnames";
import PdfIcon from "./pdf.svg";
import { monthNamesInNominativeCase, bytesToSize, downloadPdf, replaceDotWithComma, lowFirstLetter } from "@/helpers/constants";
import { MouseEventHandler, useState } from "react";
import NoDataIcon from "./nodata.svg";

interface IChargeChart {
    data: {
        date: string;
        total: number;
    }[];
    label: string;
}

export const ChargePageComponent = ({
    activeTab, setActiveTab,
    isInfoWindowOpen, setIsInfoWindowOpen,
    singlePaymentDocuments, debts
}: ChargePageComponentProps): JSX.Element => {
    const [selectedId, setSelectedId] = useState<number>(0);

    const createForm = (amount: number, spdId: number, checkingAccount: string) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://yoomoney.ru/quickpay/confirm';
        form.style.display = 'none';

        const receiverInput = document.createElement('input');
        receiverInput.type = 'hidden';
        receiverInput.name = 'receiver';
        receiverInput.value = checkingAccount;
        form.appendChild(receiverInput);

        const labelInput = document.createElement('input');
        labelInput.type = 'hidden';
        labelInput.name = 'label';
        labelInput.value = String(spdId);
        form.appendChild(labelInput);

        const quickpayInput = document.createElement('input');
        quickpayInput.type = 'hidden';
        quickpayInput.name = 'quickpay-form';
        quickpayInput.value = 'button';
        form.appendChild(quickpayInput);

        const sumInput = document.createElement('input');
        sumInput.type = 'hidden';
        sumInput.name = 'sum';
        sumInput.value = String(amount);
        form.appendChild(sumInput);

        document.body.appendChild(form);
        form.submit();
    };

    const getLastCharges = () => {
        const groupedByApartment: IChargeChart[] = [];
        singlePaymentDocuments.forEach(spd => {
            const currDebt = debts.find(debt => debt.singlePaymentDocumentId === spd.id);

            if (currDebt) {
                const existingGroup = groupedByApartment.find(group => group.label === spd.apartmentName);

                if (existingGroup) {
                    existingGroup.data.push({
                        date: String(spd.createdAt),
                        total: currDebt?.originalDebt
                    });
                } else {
                    groupedByApartment.push({
                        label: spd.apartmentName, data: [{
                            date: String(spd.createdAt),
                            total: currDebt?.originalDebt
                        }]
                    });
                }
            }
        });
        return Object.values(groupedByApartment);
    };

    const isData = singlePaymentDocuments && singlePaymentDocuments.length > 0;

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

    const getMonth = (dateString: string) => {
        const date = new Date(dateString);
        const monthNumber = date.getMonth();
        const year = date.getFullYear();

        return `${monthNamesInNominativeCase[monthNumber]} ${year}`;
    };

    const spds: SPDData = singlePaymentDocuments && singlePaymentDocuments.reduce(
        (accumulator, spd) => {
            accumulator.apartmentNames.push(spd.apartmentName);

            accumulator.spdNames.push(getMonth(String(spd.createdAt)));

            accumulator.spdIds.push(spd.id);

            const fileSize = bytesToSize(spd.fileSize);
            accumulator.fileSizes.push(fileSize);

            return accumulator;
        },
        initialData
    ) || [];

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

    const getInfoWindow = () => {
        const debt = debts.find(debt => debt.singlePaymentDocumentId === selectedId);
        const spd = singlePaymentDocuments.find(spd => spd.id === selectedId);
        if (debt && spd) {
            const outstandingDebt = getNumber(debt.outstandingDebt);
            const originalDebt = getNumber(debt.originalDebt);
            const payed = getNumber(debt.originalDebt - debt.outstandingDebt);

            return (
                <InfoWindow
                    title={spd.apartmentName}
                    description={spd.mcName}
                    text={
                        <ChargeText
                            id={String(spd.id)}
                            total={outstandingDebt}
                            amount={originalDebt}
                            payed={payed}
                            date={lowFirstLetter(getMonth(String(spd.createdAt)))}
                            onClick={download}
                        />
                    }
                    isOpen={isInfoWindowOpen}
                    setIsOpen={setIsInfoWindowOpen}
                    buttons={[{ name: "Оплатить", onClick: () => createForm(debt.outstandingDebt, spd.id, spd.mcCheckingAccount) }]}
                    icon={<MoneyIcon />}
                />
            );
        } else return <></>;
    };

    const getNumber = (numb: number) => {
        return replaceDotWithComma(parseFloat(numb.toFixed(2)));
    };

    return (
        <>
            {getInfoWindow()}
            <div className={cn({
                [styles.noData]: !isData
            })}>
                {!isData &&
                    <span className={styles.noDataIcon}><NoDataIcon /></span>
                }
                <div className={styles.titleWrapper}>
                    {!isData &&
                        <Htag size="h1" className={styles.noDataTitle}>{
                            "Данные о начислениях ещё не добавлены"
                        }</Htag>
                    }
                    <Tabs
                        isData={isData}
                        title="Начисления"
                        tabs={[
                            { id: 1, name: "Оплата" },
                            { id: 2, name: "Графики" },
                            { id: 3, name: "Квитанции" },
                        ]}
                        activeTab={activeTab} setActiveTab={setActiveTab}
                    >
                        {activeTab === 1 &&
                            <div className={styles.debtWrapper}>
                                {debts && debts.map(debt => {
                                    if (debt.outstandingDebt !== 0) {
                                        const currSPD = singlePaymentDocuments.find(spd => spd.id === debt.singlePaymentDocumentId);
                                        const outstandingDebt = getNumber(debt.outstandingDebt);
                                        const originalDebt = getNumber(debt.originalDebt);
                                        const payed = getNumber(debt.originalDebt - debt.outstandingDebt);
                                        if (currSPD) {
                                            const createdAt = getMonth(String(currSPD.createdAt));

                                            return (
                                                <ChargeCard
                                                    key={debt.singlePaymentDocumentId}
                                                    width="26rem"
                                                    titlePart={{
                                                        text: currSPD.apartmentName,
                                                        description: currSPD.mcName,
                                                        tag: {
                                                            tag: "Оплатить",
                                                            tagIcon: <MoneyIcon />
                                                        },
                                                        textRight: `${outstandingDebt}₽`
                                                    }}
                                                    text={
                                                        <ChargeText
                                                            id={String(currSPD.id)}
                                                            className="md:hidden sm:hidden"
                                                            total={outstandingDebt}
                                                            amount={originalDebt}
                                                            payed={payed}
                                                            date={lowFirstLetter(createdAt)}
                                                            onClick={download}
                                                        />}
                                                    bottom={{
                                                        text: createdAt,
                                                        button: {
                                                            name: "Оплатить",
                                                            onClick: () => createForm(debt.outstandingDebt, currSPD.id, currSPD.mcCheckingAccount)
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        if (window.innerWidth <= 600) {
                                                            setSelectedId(currSPD.id);
                                                            setIsInfoWindowOpen(!isInfoWindowOpen);
                                                        }
                                                    }}
                                                />
                                            );
                                        }
                                    }
                                    return <></>;
                                })}
                            </div>
                        }
                        {activeTab === 2 &&
                            <Histogram data={getLastCharges()} />
                        }
                        {activeTab === 3 &&
                            <div>
                                <Table
                                    isData={isData}
                                    title="" rows={{
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
                </div>
            </div>
        </>
    );
};

const ChargeText = ({
    total, amount, payed, id,
    date, onClick, ...props
}: ChargeTextProps): JSX.Element => {
    return (
        <div className={cn(styles.textWrapper)} {...props}>
            <div className={cn(styles.chargeText, styles.mediumText)}>
                <span className="hidden md:block sm:block">Задолженность</span>
                <span>{total}₽</span>
            </div>
            <div className={styles.chargeText}>
                <span>Начислено:</span>
                <span>{amount}</span>
            </div>
            <div className={styles.chargeText}>
                <span>Оплачено:</span>
                <span>{payed}</span>
            </div>
            <div className={cn(styles.chargeText, styles.downloadText)}>
                <span>Квитанция за {date}</span>
                <span
                    id={id}
                    className={styles.download}
                    onClick={onClick}
                ><DownloadIcon /></span>
            </div>
        </div>
    );
};