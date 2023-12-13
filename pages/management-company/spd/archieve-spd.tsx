/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";
import { PAGE_LIMIT } from "@/helpers/constants";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData, handleFilter } from "@/helpers/reference-constants";
import { IAppContext } from "@/context/app.context";
import { getPagination, setPostDataForReference } from "../reference-helper";
import { ArchieveSPDPageComponent } from "@/page-components";

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

    const handleFilterClick = async (value: string[], id: string) => {
        await handleFilter(
            value, id,
            uriToGet, postDataSPDs, setPostData,
            setItemOffset
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