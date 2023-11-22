import { Table } from "@/components";
import { API } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import PdfIcon from "./icons/pdf.svg";
import { MouseEventHandler } from "react";
import { bytesToSize, downloadPdf, monthNamesInNominativeCase } from "@/helpers/constants";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { IAppContext } from "@/context/app.context";

function ArchiveSPD({ data }: IArchieveSPDProps): JSX.Element {
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

    return (
        <>
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