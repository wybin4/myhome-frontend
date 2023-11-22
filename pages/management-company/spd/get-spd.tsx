import { IPdfUrl } from "@/components/primitive/Pdf/Pdf.props";
import { IAppContext } from "@/context/app.context";
import { API, api } from "@/helpers/api";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { ISubscriberReferenceData } from "@/interfaces/reference/subscriber/subscriber.interface";
import { withLayout } from "@/layout/Layout";
import { GetSPDPageComponent } from "@/page-components";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

function GetSPD({ data }: IGetSPDProps): JSX.Element {
    const [formCheckedIds, setFormCheckedIds] = useState<number[]>([]);
    const [isHouses, setIsHouses] = useState<boolean>(true);
    const [keyRate, setKeyRate] = useState<number | undefined>(undefined);
    const [cantGetKeyRate, setCantGetKeyRate] = useState<boolean>(false);
    const [spdError, setSpdError] = useState<string | undefined>(undefined);
    const [downloadUrlDate, setDownloadUrlDate] = useState<IPdfUrl>(
        { url: "", date: new Date(0), id: 0 }
    );

    const print = () => {
        if (downloadUrlDate.url !== "") {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);

            iframe.style.display = 'none';
            iframe.src = downloadUrlDate.url;
            iframe.onload = function () {
                setTimeout(function () {
                    iframe.focus();
                    if (iframe.contentWindow) {
                        iframe.contentWindow.print();
                    }
                }, 1);
            };
        }
    };

    const fetchSPD = async (keyRate: number) => {
        const formData: IGetSPDData = {
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
                setDownloadUrlDate({ url, date: new Date(), id: 0 }); // ИСПРАВИТЬ РОУТ И NEW DATE()
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
                fetchSPD={fetchSPD} spdError={spdError}
                pdf={{ pdfUrl: downloadUrlDate, print }}
                keyRate={keyRate} setKeyRate={setKeyRate} fetchKeyRate={fetchKeyRate}
                cantGetKeyRate={cantGetKeyRate} setCantGetKeyRate={setCantGetKeyRate}
                formCheckedIds={formCheckedIds} setFormCheckedIds={setFormCheckedIds}
                isHouses={isHouses} setIsHouses={setIsHouses}
            />
        </>
    );
}

export default withLayout(GetSPD);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const apiUrl = API.reference.subscriber.get;
    return await fetchReferenceData<{ data: ISubscriberReferenceData }>(context, apiUrl, undefined);
}

interface IGetSPDProps extends Record<string, unknown>, IAppContext {
    data: ISubscriberReferenceData;
}

interface IGetSPDData {
    houseIds?: number[];
    subscriberIds?: number[];
    keyRate: number;
}