/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { IUserReferenceDataItem, UserRole, ownerPageComponent } from "@/interfaces/account/user.interface";
import { IPenaltyCalculationRuleReferenceDataItem, penaltyCalcRulePageComponent } from "@/interfaces/correction/penalty.interface";
import { IReferencePageComponent, IReferencePageItem, IReferenceData } from "@/interfaces/reference/page.interface";
import { IApartmentReferenceData, IApartmentReferenceDataItem, apartmentPageComponent } from "@/interfaces/reference/subscriber/apartment.interface";
import { IHouseReferenceData, IHouseReferenceDataItem, housePageComponent } from "@/interfaces/reference/subscriber/house.interface";
import { ISubscriberReferenceData, ISubscriberReferenceDataItem, subscriberPageComponent } from "@/interfaces/reference/subscriber/subscriber.interface";
import { ICommonHouseNeedTariffReferenceDataItem, INormReferenceDataItem, IMunicipalTariffReferenceDataItem, ISeasonalityFactorReferenceDataItem, ISocialNormReferenceDataItem, municipalTariffPageComponent, normPageComponent, seasonalityFactorPageComponent, socialNormPageComponent, сommonHouseNeedTariffPageComponent } from "@/interfaces/reference/tariff-and-norm.interface";
import { IGeneralMeterReferenceDataItem, IIndividualMeterReferenceDataItem, generalMeterPageComponent, individualMeterPageComponent } from "@/interfaces/reference/meter.interface";
import { withLayout } from "@/layout/Layout";
import { ReferencePageComponent } from "@/page-components";
import axios from "axios";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

function ReferencePage({ data }: ReferencePageProps): JSX.Element {
    const [engName, setEngName] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const engName = router.asPath.split("/")[3];
        setEngName(engName);
    }, [router.asPath]);

    const createComponent = <T extends FieldValues>(
        item: IReferencePageComponent<T>,
    ) => {
        const newItem = enrich(item);
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
        const newItem = enrich(item);
        return (
            <ReferencePageComponent<T>
                key={newItem.engName}
                item={newItem}
                uriToAdd={API.managementCompany.reference[baseEngName].add}
                uriToAddMany={API.managementCompany.reference[baseEngName].addMany}
            />
        );
    };

    const enrich = <T extends FieldValues>(
        item: IReferencePageComponent<T>,
    ): IReferencePageComponent<T> => {
        const enrichedComponent = { ...item };
        const dataFromBack = data[engName + "s"];
        if (dataFromBack) {
            const enrichedComponents = enrichedComponent.components.map(component => {
                const values = dataFromBack.map(item => item[component.id]);
                const rows = values.map(val => val ? val?.toString() : "");
                if (component.isFilter) {
                    const uniqueValues = Array.from(new Set(values));
                    const filterItems = [{
                        name: [{ word: component.title.map(t => t.word).join(" ") }],
                        items: uniqueValues.map(value => value?.toString())
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
            {engName === "individual-meter" && createBaseComponent<IIndividualMeterReferenceDataItem>("meter", individualMeterPageComponent)}
            {engName === "general-meter" && createBaseComponent<IGeneralMeterReferenceDataItem>("meter", generalMeterPageComponent)}
            {engName === "municipal-tariff" && createBaseComponent<IMunicipalTariffReferenceDataItem>("tariffAndNorm", municipalTariffPageComponent)}
            {engName === "norm" && createBaseComponent<INormReferenceDataItem>("tariffAndNorm", normPageComponent)}
            {engName === "social-norm" && createBaseComponent<ISocialNormReferenceDataItem>("tariffAndNorm", socialNormPageComponent)}
            {engName === "seasonality-factor" && createBaseComponent<ISeasonalityFactorReferenceDataItem>("tariffAndNorm", seasonalityFactorPageComponent)}
            {engName === "common-house-need" && createBaseComponent<ICommonHouseNeedTariffReferenceDataItem>("tariffAndNorm", сommonHouseNeedTariffPageComponent)}
            {engName === "penalty-rule" &&
                <ReferencePageComponent<IPenaltyCalculationRuleReferenceDataItem>
                    key={penaltyCalcRulePageComponent.engName}
                    item={penaltyCalcRulePageComponent}
                    uriToAdd={API.correction.penaltyRule.add}
                />
            }
            {engName === "owner" &&
                <ReferencePageComponent<IUserReferenceDataItem>
                    key={ownerPageComponent.engName}
                    item={ownerPageComponent}
                    uriToAdd={API.common.register.add}
                    uriToAddMany={API.common.register.addMany}
                />
            }
        </>
    );
}

export default withLayout(ReferencePage);

export async function getServerSideProps({ resolvedUrl }: any) {
    const url = resolvedUrl || "";
    const engName = url.split("/")[3];

    try {
        const apiUrl = API.managementCompany.reference[engName].get;
        const postData = {
            "managementCompanyId": 1, // ИСПРАВИТЬ
        };
        switch (engName) {
            case "house":
                return await fetchData<IHouseReferenceData>(apiUrl, postData);
            case "apartment":
                return await fetchData<IApartmentReferenceData>(apiUrl, postData);
            case "subscriber":
                return await fetchData<ISubscriberReferenceData>(apiUrl, postData);
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