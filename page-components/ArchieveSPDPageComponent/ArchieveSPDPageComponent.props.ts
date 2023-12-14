import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";
import { IArchieveSPDData } from "@/pages/management-company/spd/archieve-spd";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ArchieveSPDPageComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    singlePaymentDocuments: IArchieveSPDData[];
    isData: boolean;
    handleFilter: (value: IBaseDateRange | undefined, id: string) => Promise<void>;
}