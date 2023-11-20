import { API, api } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { ISubscriberReferenceData } from "@/interfaces/reference/subscriber/subscriber.interface";
import { withLayout } from "@/layout/Layout";
import { GetSPDPageComponent } from "@/page-components";
import axios from "axios";
import { useState } from "react";

function GetSPD({ data }: IGetSPDProps): JSX.Element {
    const [formCheckedIds, setFormCheckedIds] = useState<number[]>([]);
    const [isHouses, setIsHouses] = useState<boolean>(true);
    const [keyRate, setKeyRate] = useState<number | undefined>(undefined);
    const [cantGetKeyRate, setCantGetKeyRate] = useState<boolean>(false);
    const [spdError, setSpdError] = useState<string | undefined>(undefined);
    const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);

    const fetchSPD = async (keyRate: number) => {
        const formData: IGetSPDData = {
            managementCompanyId: 1, // ИСПРАВИТЬ
            keyRate: keyRate,
        };

        if (!isHouses) {
            formData["subscriberIds"] = formCheckedIds;
        } else {
            formData["houseIds"] = formCheckedIds;
        }

        await api.post(API.managementCompany.singlePaymentDocument.calculate, formData, {
            responseType: 'blob',
            timeout: 5000,
        }).then((response) => {
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                setDownloadUrl(url);
            } else {
                setSpdError("Что-то пошло не так");
            }
        }).catch(async (error) => {
            if (axios.isCancel(error)) {
                setSpdError("Превышено время ожидания");
            } else if (error.response) {
                const response = error.response;
                const errorJson = JSON.parse(await response.data.text());
                setSpdError(errorJson.message);
            } else {
                setSpdError("Что-то пошло не так");
            }
        });
    };


    const fetchKeyRate = async () => {
        try {
            const { data } = await api.post<{ keyRate: number }>(API.managementCompany.correction.cbr.get, null, {
                timeout: 1000,
            });
            return data;
        } catch (error) {
            setCantGetKeyRate(true);
        }
    };

    return (
        <>
            <GetSPDPageComponent
                data={data}
                fetchSPD={fetchSPD} spdError={spdError} downloadUrl={downloadUrl}
                keyRate={keyRate} setKeyRate={setKeyRate} fetchKeyRate={fetchKeyRate}
                cantGetKeyRate={cantGetKeyRate} setCantGetKeyRate={setCantGetKeyRate}
                formCheckedIds={formCheckedIds} setFormCheckedIds={setFormCheckedIds}
                isHouses={isHouses} setIsHouses={setIsHouses}
            />
        </>
    );
}

export default withLayout(GetSPD);

export async function getServerSideProps() {
    const apiUrl = API.reference.subscriber.get;
    const postData = {
        userId: 1,
        userRole: UserRole.ManagementCompany
    };

    try {
        const { data } = await api.post<{ data: ISubscriberReferenceData }>(apiUrl, postData);
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

interface IGetSPDProps extends Record<string, unknown> {
    data: ISubscriberReferenceData;
    userRole: UserRole;
    userId: number;
}

interface IGetSPDData {
    managementCompanyId: number;
    houseIds?: number[];
    subscriberIds?: number[];
    keyRate: number;
}