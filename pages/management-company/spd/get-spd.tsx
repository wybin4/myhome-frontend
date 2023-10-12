import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { ISubscriberReferenceData } from "@/interfaces/reference/subscriber/subscriber.interface";
import { withLayout } from "@/layout/Layout";
import { GetSPDPageComponent } from "@/page-components/GetSPDPageComponent/GetSPDPageComponent";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";


function GetSPD({ data }: IGetSPDProps): JSX.Element {
    const [formCheckedIds, setFormCheckedIds] = useState<number[]>([]);
    const [isHouses, setIsHouses] = useState<boolean>(true);
    const [keyRate, setKeyRate] = useState<number | undefined>(undefined);
    const [cantGetKeyRate, setCantGetKeyRate] = useState<boolean>(false);

    const fetchSPD = async (keyRate: number) => {
        try {
            const formData: IGetSPDData = {
                managementCompanyId: 1, // ИСПРАВИТЬ
                keyRate: keyRate
            };

            if (!isHouses) {
                formData["subscriberIds"] = formCheckedIds;
            } else {
                formData["houseIds"] = formCheckedIds;
            }

            const response = await axios.post(API.managementCompany.singlePaymentDocument.get, formData, {
                responseType: 'blob',
                timeout: 5000
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = String(Date.now());
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Ошибка при получении PDF:', response.statusText);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                console.error('Запрос был отменен из-за превышения времени ожидания');
            } else {
                console.error('Ошибка при получении PDF:', error);
            }
        }
    };

    const fetchKeyRate = async () => {
        try {
            const { data } = await axios.post<{ keyRate: number }>(API.managementCompany.correction.cbr.get);
            return data;
        } catch (error) {
            setCantGetKeyRate(true);
        }
    };

    return (
        <>
            <GetSPDPageComponent
                data={data} fetchSPD={fetchSPD}
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
    const apiUrl = API.managementCompany.reference["subscriber"].get;
    const postData = {
        managementCompanyId: 1
    };

    try {
        const { data } = await axios.post<{ data: ISubscriberReferenceData }>(apiUrl, postData);
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
    role: UserRole;
    isFormOpened: boolean;
    setIsFormOpened: Dispatch<SetStateAction<boolean>>;
}

interface IGetSPDData {
    managementCompanyId: number;
    houseIds?: number[];
    subscriberIds?: number[];
    keyRate: number;
}