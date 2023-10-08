/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { IUserReferenceData, IUserReferenceDataItem, UserRole, ownerPageComponent } from "@/interfaces/account/user.interface";
import { IPenaltyCalculationRuleReferenceData, IPenaltyCalculationRuleReferenceDataItem, penaltyCalcRulePageComponent } from "@/interfaces/correction/penalty.interface";
import { IIndividualMeterReferenceDataItem, individualMeterPageComponent, IGeneralMeterReferenceDataItem, generalMeterPageComponent, IGeneralMeterReferenceData, IIndividualMeterReferenceData } from "@/interfaces/reference/meter.interface";
import { IReferencePageComponent, IReferencePageItem, IReferenceData } from "@/interfaces/reference/page.interface";
import { IApartmentReferenceData, IApartmentReferenceDataItem, apartmentPageComponent } from "@/interfaces/reference/subscriber/apartment.interface";
import { IHouseReferenceData, IHouseReferenceDataItem, housePageComponent } from "@/interfaces/reference/subscriber/house.interface";
import { ISubscriberReferenceData, ISubscriberReferenceDataItem, subscriberPageComponent } from "@/interfaces/reference/subscriber/subscriber.interface";
import { IMunicipalTariffReferenceDataItem, municipalTariffPageComponent, INormReferenceDataItem, normPageComponent, ISocialNormReferenceDataItem, socialNormPageComponent, ISeasonalityFactorReferenceDataItem, seasonalityFactorPageComponent, ICommonHouseNeedTariffReferenceDataItem, сommonHouseNeedTariffPageComponent, ICommonHouseNeedTariffReferenceData, IMunicipalTariffReferenceData, INormReferenceData, ISeasonalityFactorReferenceData, ISocialNormReferenceData } from "@/interfaces/reference/tariff-and-norm.interface";
import { withLayout } from "@/layout/Layout";
import { ReferencePageComponent } from "@/page-components";
import axios from "axios";
import { format, isDate, isValid } from "date-fns";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

function ReferencePage({ data }: ReferencePageProps): JSX.Element {
    const [engName, setEngName] = useState<string>("");
    const router = useRouter();

    const getEngName = () => {
        let engName = router.asPath.split("/")[3];
        switch (engName) {
            case "individual-meter":
                engName = "individualMeter";
                break;
            case "general-meter":
                engName = "generalMeter";
                break;
        }
        return engName;
    };

    useEffect(() => {
        setEngName(getEngName());
    }, [router.asPath]);

    const createComponent = <T extends FieldValues>(
        item: IReferencePageComponent<T>,
    ) => {
        const newItem = enrich(item, engName);
        return (
            <ReferencePageComponent<T>
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
        const newItem = enrich(item, baseEngName);
        return (
            <ReferencePageComponent<T>
                key={newItem.engName}
                item={newItem}
                uriToAdd={API.managementCompany.reference[baseEngName].add}
                uriToAddMany={API.managementCompany.reference[baseEngName].addMany}
            />
        );
    };

    const parseValue = (value: string) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        if (dateRegex.test(value)) {
            return new Date(value);
        }
        const numberValue = parseFloat(value);
        if (!isNaN(numberValue)) {
            return numberValue;
        }
        return value;
    };

    const valueFormat = (value: string | number | Date) => {
        if (typeof value === "string") {
            const parsed = parseValue(value);
            if (isDate(parsed) && isValid(parsed)) {
                return String(format(parsed as Date, 'dd.MM.yyyy'));
            } else return String(value);
        } else if (isDate(value) && isValid(value)) {
            return String(format(value, 'dd.MM.yyyy'));
        } else {
            return String(value);
        }
    };

    const enrich = <T extends FieldValues>(
        item: IReferencePageComponent<T>, baseEngName: string
    ): IReferencePageComponent<T> => {
        const enrichedComponent = { ...item };
        const dataFromBack = data[baseEngName + "s"];
        if (dataFromBack) {
            const enrichedComponents = enrichedComponent.components.map(component => {
                const values = dataFromBack.map(item => item[component.id]);
                const rows = values.map(value => value ? valueFormat(value) : "");
                if (component.isFilter) {
                    const uniqueValues = Array.from(new Set(values));
                    const filterItems = [{
                        name: [{ word: component.title.map(t => t.word).join(" ") }],
                        items: uniqueValues.map(value => value ? valueFormat(value) : "")
                    }];

                    return {
                        ...component,
                        filterItems,
                        rows
                    } as IReferencePageItem<T>;
                }
                return {
                    ...component,
                    rows
                };
            });

            return {
                ...enrichedComponent,
                components: enrichedComponents
            };
        }

        return enrichedComponent;
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
                    key={penaltyCalcRulePageComponent.engName}
                    item={enrich(penaltyCalcRulePageComponent, "penaltyRule")}
                    uriToAdd={API.managementCompany.correction.penaltyRule.add}
                />
            }
            {engName === "owner" &&
                <ReferencePageComponent<IUserReferenceDataItem>
                    key={ownerPageComponent.engName}
                    item={enrich(ownerPageComponent, engName)}
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

    let apiUrl: string = '';
    switch (engName) {
        case "owner":
            apiUrl = API.managementCompany.common.owner.get;
            break;
        case "individual-meter":
        case "general-meter":
            apiUrl = API.managementCompany.reference["meter"].get;
            break;
        case "norm":
        case "social-norm":
        case "seasonality-factor":
        case "common-house-need-tariff":
        case "municipal-tariff":
            apiUrl = API.managementCompany.reference["tariffAndNorm"].get;
            break;
        case "penalty-rule":
            apiUrl = API.managementCompany.correction["penaltyRule"].get;
            break;
        default:
            apiUrl = API.managementCompany.reference[engName].get;
    }

    const postData: {
        [key: string]: number | string | Date | undefined
    } = {
        "managementCompanyId": 1, // ИСПРАВИТЬ
    };

    try {
        switch (engName) {
            case "house":
                return await fetchData<IHouseReferenceData>(apiUrl, postData);
            case "apartment":
                return await fetchData<IApartmentReferenceData>(apiUrl, postData);
            case "subscriber":
                return await fetchData<ISubscriberReferenceData>(apiUrl, postData);
            case "owner":
                return await fetchData<IUserReferenceData>(apiUrl, postData);
            case "individual-meter":
                postData["meterType"] = "Individual";
                return await fetchData<IIndividualMeterReferenceData>(apiUrl, postData);
            case "general-meter":
                postData["meterType"] = "General";
                return await fetchData<IGeneralMeterReferenceData>(apiUrl, postData);
            case "municipal-tariff":
                postData["type"] = "MunicipalTariff";
                return await fetchData<IMunicipalTariffReferenceData>(apiUrl, postData);
            case "norm":
                postData["type"] = "Norm";
                return await fetchData<INormReferenceData>(apiUrl, postData);
            case "social-norm":
                postData["type"] = "SocialNorm";
                return await fetchData<ISocialNormReferenceData>(apiUrl, postData);
            case "seasonality-factor":
                postData["type"] = "SeasonalityFactor";
                return await fetchData<ISeasonalityFactorReferenceData>(apiUrl, postData);
            case "common-house-need-tariff":
                postData["type"] = "CommonHouseNeedTariff";
                return await fetchData<ICommonHouseNeedTariffReferenceData>(apiUrl, postData);
            case "penalty-rule":
                return await fetchData<IPenaltyCalculationRuleReferenceData>(apiUrl, postData);
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

async function fetchData<T extends IReferenceData>
    (apiUrl: string, postData: any) {
    const { data } = await axios.post<{ data: T }>(apiUrl, postData);
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
}

interface ReferencePageProps extends Record<string, unknown> {
    data: IReferenceData;
    role: UserRole;
    isFormOpened: boolean;
    setIsFormOpened: Dispatch<SetStateAction<boolean>>;
}