/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";
import { PAGE_LIMIT } from "@/helpers/constants";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData, handleFilterDateClick } from "@/helpers/reference-constants";
import { IAppContext } from "@/context/app.context";
import { ArchieveSPDPageComponent, getPagination, setPostDataForReference } from "@/page-components";
import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";

const postDataSPDs = {
    withoutAttachments: false
};
const uriToGet = API.singlePaymentDocument.get;
const name = "singlePaymentDocument";

function ArchiveSPD({ data: initialData }: IArchieveSPDProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + PAGE_LIMIT;

    const setPostData = (newData: any, isNew?: boolean, isGet?: boolean) => {
        setPostDataForReference(setData, name, newData, isNew, isGet);
    };

    const handleFilterClick = async (value: IBaseDateRange | undefined, id: string) => {
        await handleFilterDateClick(
            value, id,
            uriToGet, postDataSPDs, setPostData,
            setItemOffset, undefined, undefined
        );
    };

    return (
        <>
            <ArchieveSPDPageComponent
                handleFilter={handleFilterClick}
                singlePaymentDocuments={data.singlePaymentDocuments.slice(itemOffset, endOffset)}
                isData={initialData.totalCount !== null || data.totalCount !== null}
            />
            {getPagination(
                setItemOffset, data, initialData, name + "s",
                uriToGet, postDataSPDs, setPostData
            )}
        </>
    );
}

export default withLayout(ArchiveSPD);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return await fetchReferenceData<{ singlePaymentDocuments: IArchieveSPDData[] }>(context, uriToGet, postDataSPDs, true);
}

interface IArchieveSPDProps extends Record<string, unknown>, IAppContext {
    data: { singlePaymentDocuments: IArchieveSPDData[]; totalCount: number };
}

export interface IArchieveSPDData {
    id: number;
    houseId: number;
    city: string;
    street: string;
    houseName: string;
    fileSize: number;
    pdfBuffer: string;
    createdAt: Date;
}