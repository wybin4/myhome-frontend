import { Table } from "@/components";
import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import PdfIcon from "./icons/pdf.svg";
import { MouseEventHandler } from "react";

function ArchiveSPD({ data }: IArchieveSPDProps): JSX.Element {

    let cities = data.singlePaymentDocuments.map(spd => spd.city);
    cities = Array.from(new Set(cities));

    let streets = data.singlePaymentDocuments.map(spd => spd.street);
    streets = Array.from(new Set(streets));

    let houseNames = data.singlePaymentDocuments.map(spd => spd.houseName);
    houseNames = Array.from(new Set(houseNames));

    const bytesToSize = (bytes: number, decimals = 0) => {
        const kbToBytes = 1000;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = [
            'Б',
            'КБ',
            'МБ',
            'ГБ',
            'ТБ',
        ];

        const index = Math.floor(
            Math.log(bytes) / Math.log(kbToBytes),
        );

        return `${parseFloat(
            (bytes / Math.pow(kbToBytes, index)).toFixed(dm),
        )} ${sizes[index]}`;
    };

    const spdNames = data.singlePaymentDocuments.map(spd => {
        const date = new Date(spd.createdAt);
        const monthNumber = date.getMonth();
        const year = date.getFullYear();

        const monthNamesInNominativeCase = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return `${monthNamesInNominativeCase[monthNumber]} ${year}, ${spd.street} ${spd.houseName}`;
    });

    const spdIds = data.singlePaymentDocuments.map(spd => spd.id);

    const fileSizes = data.singlePaymentDocuments.map(spd => {
        const fileSize = bytesToSize(spd.fileSize);
        return fileSize;
    });

    const download: MouseEventHandler<HTMLDivElement> = (event) => {
        const spd = data.singlePaymentDocuments.find(s => s.id === Number(event.currentTarget.id));
        if (spd && spd.pdfBuffer) {
            const base64Data = spd.pdfBuffer;
            const buffer = Buffer.from(base64Data, 'base64');

            const blob = new Blob([buffer]);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${new Date(spd.createdAt).getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
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
                        items: cities
                    },
                    {
                        title: "Улица",
                        titleEng: "street",
                        type: "checkbox",
                        items: streets
                    },
                    {
                        title: "Дом",
                        titleEng: "houseName",
                        type: "checkbox",
                        items: houseNames
                    }
                ]} rows={{
                    startIcon: <PdfIcon />,
                    actions: {
                        actions: [{
                            type: "download",
                            onClick: download
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
                }} buttons={[]} />
        </>
    );
}

export default withLayout(ArchiveSPD);

export async function getServerSideProps() {
    const apiUrl = API.managementCompany.singlePaymentDocument.get;
    const postData = {
        managementCompanyId: 1
    };

    try {
        const { data } = await axios.post<{ singlePaymentDocuments: IArchieveSPDData[] }>(apiUrl, postData);
        if (!data) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface IArchieveSPDProps extends Record<string, unknown> {
    data: { singlePaymentDocuments: IArchieveSPDData[] };
    role: UserRole;
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