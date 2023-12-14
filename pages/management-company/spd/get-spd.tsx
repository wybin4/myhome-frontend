import { IPdfUrl } from "@/components/primitive/Pdf/Pdf.props";
import { IAppContext } from "@/context/app.context";
import { API, api } from "@/helpers/api";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { ISubscriberReferenceData } from "@/interfaces/reference/subscriber/subscriber.interface";
import { ICommonHouseNeedTariffReferenceDataItem, IMunicipalTariffReferenceDataItem, INormReferenceDataItem, TariffAndNormType } from "@/interfaces/reference/tariff-and-norm.interface";
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

    try {
        const { props: subscriberProps } = await fetchReferenceData<{ data: ISubscriberReferenceData }>(context, apiUrl, undefined);
        const { props: municipalProps } = await fetchReferenceData<{ tariffAndNorms: IMunicipalTariffReferenceDataItem[] }>(context, API.reference.tariffAndNorm.get, { type: TariffAndNormType.MunicipalTariff });
        const { props: commonProps } = await fetchReferenceData<{ tariffAndNorms: ICommonHouseNeedTariffReferenceDataItem[] }>(context, API.reference.tariffAndNorm.get, { type: TariffAndNormType.CommonHouseNeedTariff });
        const { props: normProps } = await fetchReferenceData<{ tariffAndNorms: INormReferenceDataItem[] }>(context, API.reference.tariffAndNorm.get, { type: TariffAndNormType.Norm });

        if (!subscriberProps || !municipalProps || !commonProps || !normProps) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                data: {
                    subscribers: ('subscribers' in subscriberProps.data) ? subscriberProps.data.subscribers : [],
                    municipalTariffs: ('tariffAndNorms' in municipalProps.data) ? municipalProps.data.tariffAndNorms : [],
                    commonHouseNeeds: ('tariffAndNorms' in commonProps.data) ? commonProps.data.tariffAndNorms : [],
                    norms: ('tariffAndNorms' in normProps.data) ? normProps.data.tariffAndNorms : [],
                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface IGetSPDProps extends Record<string, unknown>, IAppContext {
    data: ISubscriberReferenceData & {
        municipalTariffs: IMunicipalTariffReferenceDataItem[];
        commonHouseNeeds: ICommonHouseNeedTariffReferenceDataItem[];
        norms: INormReferenceDataItem[];
    };
}

interface IGetSPDData {
    houseIds?: number[];
    subscriberIds?: number[];
    keyRate: number;
}