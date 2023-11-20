import { API, api } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import { ChargePageComponent } from "@/page-components";
import { ISpdData } from "@/page-components/ChargePageComponent/ChargePageComponent.props";
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

export async function getServerSideProps() {
    const apiUrl = API.subscriber.singlePaymentDocument.get;
    const postData = {
        subscriberIds: [1] // ИСПРАВИТЬ!!!!
    };

    try {
        const { data } = await api.post<{ singlePaymentDocuments: ISpdData[] }>(apiUrl, postData);
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

interface IChargeProps extends Record<string, unknown> {
    data: { singlePaymentDocuments: ISpdData[] };
    userRole: UserRole;
    userId: number;
}

export default withLayout(Charge);
