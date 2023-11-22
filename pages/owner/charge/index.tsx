import { IAppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { withLayout } from "@/layout/Layout";
import { ChargePageComponent } from "@/page-components";
import { ISpdData } from "@/page-components/ChargePageComponent/ChargePageComponent.props";
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
            />
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const apiUrl = API.singlePaymentDocument.get;
    return await fetchReferenceData<{ singlePaymentDocuments: ISpdData[] }>(context, apiUrl, undefined);
}

interface IChargeProps extends Record<string, unknown>, IAppContext {
    data: { singlePaymentDocuments: ISpdData[] };
}

export default withLayout(Charge);
