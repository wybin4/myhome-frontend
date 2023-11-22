import { Pdf, Table } from "@/components";
import { API } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import PdfIcon from "./icons/pdf.svg";
import { MouseEventHandler, useState } from "react";
import { bytesToSize, downloadPdf, monthNamesInNominativeCase, printPdf } from "@/helpers/constants";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { IAppContext } from "@/context/app.context";
import { IPdfUrl } from "@/components/primitive/Pdf/Pdf.props";

function ArchiveSPD({ data }: IArchieveSPDProps): JSX.Element {
    const [isOneSPD, setIsOneSPD] = useState<boolean>(false);
    const [downloadUrlDate, setDownloadUrlDate] = useState<IPdfUrl>(
        { url: "", date: new Date(0), id: 0 }
    );

    type SPDData = {
        cities: string[];
        streets: string[];
        houseNames: string[];
        spdNames: string[];
        spdIds: number[];
        fileSizes: string[];
    };

    const initialData: SPDData = {
        cities: [],
        streets: [],
        houseNames: [],
        spdNames: [],
        spdIds: [],
        fileSizes: [],
    };

    const uniqueArray = (arr: string[]) => {
        return Array.from(new Set(arr));
    };

    const result: SPDData = data.singlePaymentDocuments.reduce(
        (accumulator, spd) => {
            accumulator.cities.push(spd.city);
            accumulator.streets.push(spd.street);
            accumulator.houseNames.push(spd.houseName);

            const date = new Date(spd.createdAt);
            const monthNumber = date.getMonth();
            const year = date.getFullYear();

            accumulator.spdNames.push(
                `${monthNamesInNominativeCase[monthNumber]} ${year}, ${spd.street} ${spd.houseName}`
            );

            accumulator.spdIds.push(spd.id);

            const fileSize = bytesToSize(spd.fileSize);
            accumulator.fileSizes.push(fileSize);

            return accumulator;
        },
        initialData
    );

    const {
        cities,
        streets,
        houseNames,
        spdNames,
        spdIds,
        fileSizes,
    } = result;

    const uniqueCities = uniqueArray(cities);
    const uniqueStreets = uniqueArray(streets);
    const uniqueHouseNames = uniqueArray(houseNames);

    const download: MouseEventHandler<HTMLDivElement> = (event) => {
        const spd = data.singlePaymentDocuments.find(s => s.id === parseInt(event.currentTarget.id));
        if (spd && spd.pdfBuffer) {
            downloadPdf(spd.pdfBuffer, String(spd.createdAt));
        }
    };

    const print = () => {
        const spd = data.singlePaymentDocuments.find(s => s.id === downloadUrlDate.id);
        if (spd && spd.pdfBuffer) {
            printPdf(spd.pdfBuffer);
        }
    };

    const back = () => {
        setDownloadUrlDate({ url: "", date: new Date(0), id: 0 });
        setIsOneSPD(false);
    };

    const open: MouseEventHandler<HTMLDivElement> = (event) => {
        const spd = data.singlePaymentDocuments.find(s => s.id === parseInt(event.currentTarget.id));
        if (spd && spd.pdfBuffer) {
            const base64Data = spd.pdfBuffer;
            const buffer = Buffer.from(base64Data, 'base64');
            const blob = new Blob([buffer]);
            const url = window.URL.createObjectURL(blob);
            setDownloadUrlDate({ url, date: spd.createdAt, id: spd.id });
            setIsOneSPD(true);
        }
    };

    return (
        <>
            {!isOneSPD &&
                <Table title="Архив"
                    filters={[
                        {
                            title: "Город",
                            titleEng: "city",
                            type: "checkbox",
                            items: uniqueCities
                        },
                        {
                            title: "Улица",
                            titleEng: "street",
                            type: "checkbox",
                            items: uniqueStreets
                        },
                        {
                            title: "Дом",
                            titleEng: "houseName",
                            type: "checkbox",
                            items: uniqueHouseNames
                        },
                        // ИСПРАВИТЬ!!! ДОБАВИТЬ ВЫБОР ПЕРИОДА
                    ]} rows={{
                        startIcon: <PdfIcon />,
                        actions: {
                            actions: [{
                                type: "download",
                                onClick: download,
                                id: 0
                            },
                            {
                                type: "open",
                                onClick: open,
                                id: 0,
                            }]
                        },
                        ids: spdIds,
                        items: [
                            {
                                title: "ЕПД",
                                type: "text",
                                items: spdNames
                            },
                            {
                                title: "Размер",
                                type: "text",
                                items: fileSizes
                            }
                        ],
                        keyElements: { first: [0], second: 1, isSecondNoNeedTitle: true }
                    }} />
            }
            {isOneSPD &&
                <div>
                    <Pdf back={back} print={print} pdfUrl={downloadUrlDate} />
                </div>
            }
        </>
    );
}

export default withLayout(ArchiveSPD);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const apiUrl = API.singlePaymentDocument.get;
    return await fetchReferenceData<{ singlePaymentDocuments: IArchieveSPDData[] }>(context, apiUrl, undefined);
}

interface IArchieveSPDProps extends Record<string, unknown>, IAppContext {
    data: { singlePaymentDocuments: IArchieveSPDData[] };
}

interface IArchieveSPDData {
    id: number;
    houseId: number;
    city: string;
    street: string;
    houseName: string;
    fileSize: number;
    pdfBuffer: string;
    createdAt: Date;
}