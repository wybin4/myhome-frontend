/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { enrichReferenceComponent, fetchReferenceData } from "@/helpers/reference-constants";
import { IUserReferenceData, IUserReferenceDataItem, UserRole, managementCompanyPageComponent } from "@/interfaces/account/user.interface";
import { IReferenceData } from "@/interfaces/reference/page.interface";
import { withLayout } from "@/layout/Layout";
import { ReferencePageComponent } from "@/page-components";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function ReferencePage({ data: initialData }: ReferencePageProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [engName, setEngName] = useState<string>("");
    const router = useRouter();

    const getEngName = () => {
        let engName = router.asPath.split("/")[3];
        switch (engName) {
            case "management-company":
                engName = "profile";
                break;
        }
        return engName;
    };

    useEffect(() => {
        setEngName(getEngName());
    }, [router.asPath]);

    const setPostData = (newData: any) => {
        setData(prevData => {
            const newDataArray = [...prevData[engName + "s"], newData[engName]];
            return { ...prevData, [engName + "s"]: newDataArray };
        });
    };

    return (
        <>
            {/* {engName === "penalty-calculation-rule" &&
                <ReferencePageComponent<IPenaltyCalculationRuleReferenceDataItem>
                    key={penaltyCalcRulePageComponent.engName}
                    item={enrichReferenceComponent(data, penaltyCalcRulePageComponent, "penaltyCalculationRule")}
                    uriToAdd={API.managementCompany.correction.penaltyRule.add}
                />
            } */}
            {engName === "profile" &&
                <ReferencePageComponent<IUserReferenceDataItem>
                    additionalFormData={[{
                        userRole: UserRole.ManagementCompany,
                        registerRole: UserRole.Admin // ИСПРАВИТЬ!!!
                    }]}
                    setPostData={setPostData}
                    key={managementCompanyPageComponent.engName}
                    item={enrichReferenceComponent(data, managementCompanyPageComponent, engName)}
                    uriToAdd={API.admin.reference["managementCompany"].add}
                    uriToAddMany={API.admin.reference["managementCompany"].addMany}
                />
            }
        </>
    );
}

export default withLayout(ReferencePage);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const url = context.resolvedUrl || "";
    const engName = url.split("/")[3];

    let apiUrl: string = '';
    switch (engName) {
        case "management-company":
            apiUrl = API.admin.reference["managementCompany"].get;
            break;
        case "penalty-calculation-rule": {
            apiUrl = API.admin.correction.penaltyCalculationRule.get;
            break;
        }
        default:
            apiUrl = API.reference[engName].get;
    }

    try {
        switch (engName) {
            case "management-company": {
                const mcPostData = {
                    "userRole": UserRole.ManagementCompany,
                    "requesterRole": UserRole.Admin
                };
                return await fetchReferenceData<IUserReferenceData>(context, apiUrl, mcPostData);
            }
            // case "penalty-calculation-rule":
            //     return await fetchData<IApartmentReferenceData>(apiUrl, postData);
            default:
                return {
                    notFound: true
                };
        }
    } catch {
        return {
            notFound: true
        };
    }
}

interface ReferencePageProps extends Record<string, unknown> {
    data: IReferenceData;
    userRole: UserRole;
    userId: number;
}