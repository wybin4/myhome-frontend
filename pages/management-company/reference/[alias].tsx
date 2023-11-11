/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { enrichReferenceComponent, fetchReferenceData } from "@/helpers/reference-constants";
import { IUserReferenceData, IUserReferenceDataItem, UserRole, ownerPageComponent } from "@/interfaces/account/user.interface";
import { IPenaltyCalculationRuleReferenceData, IPenaltyCalculationRuleReferenceDataItem, penaltyCalcRulePageComponent } from "@/interfaces/correction/penalty.interface";
import { IIndividualMeterReferenceDataItem, individualMeterPageComponent, IGeneralMeterReferenceDataItem, generalMeterPageComponent, IGeneralMeterReferenceData, IIndividualMeterReferenceData } from "@/interfaces/reference/meter.interface";
import { IReferencePageComponent, IReferenceData } from "@/interfaces/reference/page.interface";
import { IApartmentReferenceData, IApartmentReferenceDataItem, apartmentPageComponent } from "@/interfaces/reference/subscriber/apartment.interface";
import { IHouseReferenceData, IHouseReferenceDataItem, housePageComponent } from "@/interfaces/reference/subscriber/house.interface";
import { ISubscriberReferenceData, ISubscriberReferenceDataItem, subscriberPageComponent } from "@/interfaces/reference/subscriber/subscriber.interface";
import { IMunicipalTariffReferenceDataItem, municipalTariffPageComponent, INormReferenceDataItem, normPageComponent, ISocialNormReferenceDataItem, socialNormPageComponent, ISeasonalityFactorReferenceDataItem, seasonalityFactorPageComponent, ICommonHouseNeedTariffReferenceDataItem, сommonHouseNeedTariffPageComponent, ICommonHouseNeedTariffReferenceData, IMunicipalTariffReferenceData, INormReferenceData, ISeasonalityFactorReferenceData, ISocialNormReferenceData } from "@/interfaces/reference/tariff-and-norm.interface";
import { withLayout } from "@/layout/Layout";
import { ReferencePageComponent } from "@/page-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

function ReferencePage({ data: initialData }: ReferencePageProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [engName, setEngName] = useState<string>("");
    const router = useRouter();

    const additionalFormData = [{ managementCompanyId: 1 }];

    const getEngName = () => {
        let engName = router.asPath.split("/")[3];
        switch (engName) {
            case "individual-meter":
                engName = "individualMeter";
                break;
            case "general-meter":
                engName = "generalMeter";
                break;
            case "owner":
                engName = "user";
                break;
            case "penalty-rule":
                engName = "penaltyRule";
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

    const createComponent = <T extends FieldValues>(
        item: IReferencePageComponent<T>,
    ) => {
        const newItem = enrichReferenceComponent(data, item, engName);
        return (
            <ReferencePageComponent<T>
                setPostData={setPostData}
                additionalFormData={additionalFormData}
                key={newItem.engName}
                item={newItem}
                uriToAdd={API.managementCompany.reference[engName].add}
                uriToAddMany={API.managementCompany.reference[engName].addMany}
            />
        );
    };

    const createBaseComponent = <T extends FieldValues>(
        baseEngName: string,
        item: IReferencePageComponent<T>,
    ) => {
        const newItem = enrichReferenceComponent(data, item, baseEngName);
        return (
            <ReferencePageComponent<T>
                setPostData={setPostData}
                additionalFormData={additionalFormData}
                key={newItem.engName}
                item={newItem}
                uriToAdd={API.managementCompany.reference[baseEngName].add}
                uriToAddMany={API.managementCompany.reference[baseEngName].addMany}
            />
        );
    };

    return (
        <>
            {engName === "house" && createComponent<IHouseReferenceDataItem>(housePageComponent)}
            {engName === "apartment" && createComponent<IApartmentReferenceDataItem>(apartmentPageComponent)}
            {engName === "subscriber" && createComponent<ISubscriberReferenceDataItem>(subscriberPageComponent)}
            {engName === "individualMeter" && createBaseComponent<IIndividualMeterReferenceDataItem>("meter", individualMeterPageComponent)}
            {engName === "generalMeter" && createBaseComponent<IGeneralMeterReferenceDataItem>("meter", generalMeterPageComponent)}
            {engName === "municipal-tariff" && createBaseComponent<IMunicipalTariffReferenceDataItem>("tariffAndNorm", municipalTariffPageComponent)}
            {engName === "norm" && createBaseComponent<INormReferenceDataItem>("tariffAndNorm", normPageComponent)}
            {engName === "social-norm" && createBaseComponent<ISocialNormReferenceDataItem>("tariffAndNorm", socialNormPageComponent)}
            {engName === "seasonality-factor" && createBaseComponent<ISeasonalityFactorReferenceDataItem>("tariffAndNorm", seasonalityFactorPageComponent)}
            {engName === "common-house-need-tariff" && createBaseComponent<ICommonHouseNeedTariffReferenceDataItem>("tariffAndNorm", сommonHouseNeedTariffPageComponent)}
            {engName === "penalty-rule" &&
                <ReferencePageComponent<IPenaltyCalculationRuleReferenceDataItem>
                    setPostData={setPostData}
                    additionalFormData={additionalFormData}
                    key={penaltyCalcRulePageComponent.engName}
                    item={enrichReferenceComponent(data, penaltyCalcRulePageComponent, "penaltyRule")}
                    uriToAdd={API.managementCompany.correction.penaltyRule.add}
                />
            }
            {engName === "owner" &&
                <ReferencePageComponent<IUserReferenceDataItem>
                    setPostData={setPostData}
                    additionalFormData={additionalFormData}
                    key={ownerPageComponent.engName}
                    item={enrichReferenceComponent(data, ownerPageComponent, "user")}
                    uriToAdd={API.managementCompany.common.owner.add}
                    uriToAddMany={API.managementCompany.common.owner.addMany}
                />
            }
        </>
    );
}

export default withLayout(ReferencePage);

export async function getServerSideProps({ resolvedUrl }: any) {
    const url = resolvedUrl || "";
    const engName = url.split("/")[3];

    let postData: {
        [key: string]: number | string | Date | undefined
    } = {
        "userId": 1, // ИСПРАВИТЬ
        "userRole": UserRole.ManagementCompany
    };

    let apiUrl: string = '';
    switch (engName) {
        case "owner":
            apiUrl = API.common.owner.get;
            break;
        case "individual-meter":
        case "general-meter":
            apiUrl = API.reference["meter"].get;
            break;
        case "norm":
        case "social-norm":
        case "seasonality-factor":
        case "common-house-need-tariff":
        case "municipal-tariff": {
            postData = {
                "managementCompanyId": 1, // ИСПРАВИТЬ
            };
            apiUrl = API.reference["tariffAndNorm"].get;
            break;
        }
        case "penalty-rule": {
            postData = {
                "managementCompanyId": 1, // ИСПРАВИТЬ
            };
            apiUrl = API.managementCompany.correction["penaltyRule"].get;
            break;
        }
        default:
            apiUrl = API.reference[engName].get;
    }

    try {
        switch (engName) {
            case "house":
                return await fetchReferenceData<IHouseReferenceData>(apiUrl, postData);
            case "apartment":
                return await fetchReferenceData<IApartmentReferenceData>(apiUrl, postData);
            case "subscriber":
                return await fetchReferenceData<ISubscriberReferenceData>(apiUrl, postData);
            case "owner":
                return await fetchReferenceData<IUserReferenceData>(apiUrl, postData);
            case "individual-meter":
                postData["meterType"] = "Individual";
                return await fetchReferenceData<IIndividualMeterReferenceData>(apiUrl, postData);
            case "general-meter":
                postData["meterType"] = "General";
                return await fetchReferenceData<IGeneralMeterReferenceData>(apiUrl, postData);
            case "municipal-tariff":
                postData["type"] = "MunicipalTariff";
                return await fetchReferenceData<IMunicipalTariffReferenceData>(apiUrl, postData);
            case "norm":
                postData["type"] = "Norm";
                return await fetchReferenceData<INormReferenceData>(apiUrl, postData);
            case "social-norm":
                postData["type"] = "SocialNorm";
                return await fetchReferenceData<ISocialNormReferenceData>(apiUrl, postData);
            case "seasonality-factor":
                postData["type"] = "SeasonalityFactor";
                return await fetchReferenceData<ISeasonalityFactorReferenceData>(apiUrl, postData);
            case "common-house-need-tariff":
                postData["type"] = "CommonHouseNeedTariff";
                return await fetchReferenceData<ICommonHouseNeedTariffReferenceData>(apiUrl, postData);
            case "penalty-rule":
                return await fetchReferenceData<IPenaltyCalculationRuleReferenceData>(apiUrl, postData);
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
    role: UserRole;
}