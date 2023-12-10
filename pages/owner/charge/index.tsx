import { IAppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { withLayout } from "@/layout/Layout";
import { ChargePageComponent } from "@/page-components";
import { IGetDebt, ISpdData } from "@/page-components/ChargePageComponent/ChargePageComponent.props";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

function Charge({ data }: IChargeProps): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);

    return (
        <>
            <ChargePageComponent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isInfoWindowOpen={isInfoWindowOpen}
                setIsInfoWindowOpen={setIsInfoWindowOpen}
                singlePaymentDocuments={data.singlePaymentDocuments}
                debts={data.debts}
            />
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const apiUrl = API.singlePaymentDocument.get;
    const { props: spdProps } = await fetchReferenceData<{ singlePaymentDocuments: ISpdData[] }>(context, apiUrl, undefined);
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
            }
        }
    };
}

interface IChargeProps extends Record<string, unknown>, IAppContext {
    data: {
        singlePaymentDocuments: ISpdData[];
        debts: IGetDebt[];
    };
}

export default withLayout(Charge);
