import { PdfProps } from "@/components/primitive/Pdf/Pdf.props";
import { ISubscriberReferenceData } from "@/interfaces/reference/subscriber/subscriber.interface";
import { IMunicipalTariffReferenceDataItem, ICommonHouseNeedTariffReferenceDataItem, INormReferenceDataItem } from "@/interfaces/reference/tariff-and-norm.interface";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";

export interface GetSPDPageComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    data: ISubscriberReferenceData & {
        municipalTariffs: IMunicipalTariffReferenceDataItem[];
        commonHouseNeeds: ICommonHouseNeedTariffReferenceDataItem[];
        norms: INormReferenceDataItem[];
    };
    fetchSPD: (keyRate: number) => Promise<void>;
    fetchKeyRate: () => Promise<{
        keyRate: number;
    } | undefined>;

    keyRate: number | undefined;
    setKeyRate: Dispatch<SetStateAction<number | undefined>>;
    cantGetKeyRate: boolean;
    setCantGetKeyRate: Dispatch<SetStateAction<boolean>>;

    formCheckedIds: number[];
    setFormCheckedIds: Dispatch<SetStateAction<number[]>>;

    isHouses: boolean;
    setIsHouses: Dispatch<SetStateAction<boolean>>;

    spdError: string | undefined;
    pdf: PdfProps;
}