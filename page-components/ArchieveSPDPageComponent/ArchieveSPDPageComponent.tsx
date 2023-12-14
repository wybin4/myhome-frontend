import { Pdf, Table } from "@/components";
import { MouseEventHandler, useState } from "react";
import { bytesToSize, downloadPdf, monthNamesInNominativeCase, printPdf } from "@/helpers/constants";
import { IPdfUrl } from "@/components/primitive/Pdf/Pdf.props";
import { ArchieveSPDPageComponentProps } from "./ArchieveSPDPageComponent.props";
import PdfIcon from "./pdf.svg";

export const ArchieveSPDPageComponent = ({
    singlePaymentDocuments, isData, handleFilter
}: ArchieveSPDPageComponentProps): JSX.Element => {
    const [isOneSPD, setIsOneSPD] = useState<boolean>(false);
    const [downloadUrlDate, setDownloadUrlDate] = useState<IPdfUrl>(
        { url: "", date: new Date(0), id: 0 }
    );

    type SPDData = {
        spdNames: string[];
        spdIds: number[];
        fileSizes: string[];
    };

    const initialSPDData: SPDData = {
        spdNames: [],
        spdIds: [],
        fileSizes: [],
    };

    const result: SPDData = singlePaymentDocuments.reduce(
        (accumulator, spd) => {
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
        initialSPDData
    );

    const {
        spdNames,
        spdIds,
        fileSizes,
    } = result;

    const download: MouseEventHandler<HTMLDivElement> = (event) => {
        const spd = singlePaymentDocuments.find(s => s.id === parseInt(event.currentTarget.id));
        if (spd && spd.pdfBuffer) {
            downloadPdf(spd.pdfBuffer, String(spd.createdAt));
        }
    };

    const print = () => {
        const spd = singlePaymentDocuments.find(s => s.id === downloadUrlDate.id);
        if (spd && spd.pdfBuffer) {
            printPdf(spd.pdfBuffer);
        }
    };

    const back = () => {
        setDownloadUrlDate({ url: "", date: new Date(0), id: 0 });
        setIsOneSPD(false);
    };

    const open: MouseEventHandler<HTMLDivElement> = (event) => {
        const spd = singlePaymentDocuments.find(s => s.id === parseInt(event.currentTarget.id));
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
                    isData={isData}
                    filters={[
                        {
                            title: "Период",
                            titleEng: "createdAt",
                            type: "date",
                            handleDateRangeClick: handleFilter
                        }
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
};