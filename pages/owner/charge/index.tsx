import { IAppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { PAGE_LIMIT } from "@/helpers/constants";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { withLayout } from "@/layout/Layout";
import { ChargePageComponent } from "@/page-components";
import { IGetDebt, ISpdData } from "@/page-components/ChargePageComponent/ChargePageComponent.props";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

function Charge({ data }: IChargeProps): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + PAGE_LIMIT;

    return (
        <>
            <ChargePageComponent
                setItemOffset={setItemOffset}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isInfoWindowOpen={isInfoWindowOpen}
                setIsInfoWindowOpen={setIsInfoWindowOpen}
                singlePaymentDocuments={data.singlePaymentDocuments.slice(itemOffset, endOffset)}
                allSinglePaymentDocuments={data.singlePaymentDocuments}
                debts={data.debts}
                totalCount={data.totalCount}
            />
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const apiUrl = API.singlePaymentDocument.get;
    const { props: spdProps } = await fetchReferenceData<{ singlePaymentDocuments: ISpdData[] }>(context, apiUrl, undefined, true);
    const { props: debtProps } = await fetchReferenceData<{ debts: IGetDebt[] }>(context, API.subscriber.debt.get, undefined);

    if (!spdProps || !debtProps) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            data: {
                singlePaymentDocuments: ('singlePaymentDocuments' in spdProps.data) ? spdProps.data.singlePaymentDocuments : [],
                debts: ('debts' in debtProps.data) ? debtProps.data.debts : [],
                totalCount: ('totalCount' in spdProps.data) ? spdProps.data.totalCount : [],
            }
        }
    };
}

interface IChargeProps extends Record<string, unknown>, IAppContext {
    data: {
        singlePaymentDocuments: ISpdData[];
        debts: IGetDebt[];
        totalCount: number;
    };
}

export default withLayout(Charge);
