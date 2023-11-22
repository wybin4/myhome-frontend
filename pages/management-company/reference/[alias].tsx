/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { enrichReferenceComponent, fetchReferenceData } from "@/helpers/reference-constants";
import { IUser, IUserReferenceData, IUserReferenceDataItem, UserRole, ownerPageComponent } from "@/interfaces/account/user.interface";
import { IGetCommon, ITypeOfService } from "@/interfaces/common.interface";
import { IPenaltyCalculationRuleReferenceData, IPenaltyCalculationRuleReferenceDataItem, penaltyCalcRulePageComponent } from "@/interfaces/correction/penalty.interface";
import { IIndividualMeterReferenceDataItem, individualMeterPageComponent, IGeneralMeterReferenceDataItem, generalMeterPageComponent, IGeneralMeterReferenceData, IIndividualMeterReferenceData, MeterType } from "@/interfaces/reference/meter.interface";
import { IReferencePageComponent, IReferenceData } from "@/interfaces/reference/page.interface";
import { IApartmentReferenceData, IApartmentReferenceDataItem, IGetApartment, apartmentPageComponent } from "@/interfaces/reference/subscriber/apartment.interface";
import { IGetHouse, IHouseReferenceData, IHouseReferenceDataItem, housePageComponent } from "@/interfaces/reference/subscriber/house.interface";
import { ISubscriberReferenceData, ISubscriberReferenceDataItem, subscriberPageComponent } from "@/interfaces/reference/subscriber/subscriber.interface";
import { IMunicipalTariffReferenceDataItem, municipalTariffPageComponent, INormReferenceDataItem, normPageComponent, ISocialNormReferenceDataItem, socialNormPageComponent, ISeasonalityFactorReferenceDataItem, seasonalityFactorPageComponent, ICommonHouseNeedTariffReferenceDataItem, сommonHouseNeedTariffPageComponent, TariffAndNormType, IBaseTariffAndNormReferenceData } from "@/interfaces/reference/tariff-and-norm.interface";
import { withLayout } from "@/layout/Layout";
import { ReferencePageComponent } from "@/page-components";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

function ReferencePage({ data: initialData }: ReferencePageProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [engName, setEngName] = useState<string>("");
    const [baseEngName, setBaseEngName] = useState<string>("");
    const router = useRouter();

    const getAdditionalFormData = () => {
        switch (engName) {
            case "individualMeter":
                return { additionalFormData: [{ "meterType": MeterType.Individual }] };
            case "generalMeter":
                return { additionalFormData: [{ "meterType": MeterType.General }] };
            case "socialNorm":
                return { additionalFormData: [{ "type": TariffAndNormType.SocialNorm }] };
            case "norm":
                return { additionalFormData: [{ "type": TariffAndNormType.Norm }] };
            case "seasonalityFactor":
                return { additionalFormData: [{ "type": TariffAndNormType.SeasonalityFactor }] };
            case "municipalTariff":
                return { additionalFormData: [{ "type": TariffAndNormType.MunicipalTariff }] };
            case "commonHouseNeedTariff":
                return { additionalFormData: [{ "type": TariffAndNormType.CommonHouseNeedTariff }] };
        }
        return;
    };

    const getEngName = () => {
        let engName = router.asPath.split("/")[3];
        let baseEngName;
        switch (engName) {
            case "individual-meter":
                baseEngName = "meter";
                engName = "individualMeter";
                break;
            case "general-meter":
                baseEngName = "meter";
                engName = "generalMeter";
                break;
            case "owner":
                baseEngName = "user";
                engName = "user";
                break;
            case "norm":
                engName = "norm";
                baseEngName = "tariffAndNorm";
                break;
            case "social-norm":
                engName = "socialNorm";
                baseEngName = "tariffAndNorm";
                break;
            case "seasonality-factor":
                engName = "seasonalityFactor";
                baseEngName = "tariffAndNorm";
                break;
            case "common-house-need-tariff":
                engName = "commonHouseNeedTariff";
                baseEngName = "tariffAndNorm";
                break;
            case "municipal-tariff": {
                engName = "municipalTariff";
                baseEngName = "tariffAndNorm";
                break;
            }
            case "penalty-rule":
                baseEngName = "penaltyRule";
                engName = "penaltyRule";
                break;
            default:
                baseEngName = engName;
                break;
        }
        return { engName, baseEngName };
    };

    useEffect(() => {
        const { engName, baseEngName } = getEngName();
        setEngName(engName);
        setBaseEngName(baseEngName);
    }, [router.asPath]);

    const setPostData = (newData: any) => {
        setData(prevData => {
            const newDataArray = [...prevData[baseEngName + "s"], newData[baseEngName]];
            return { ...prevData, [baseEngName + "s"]: newDataArray };
        });
    };

    const createComponent = <T extends FieldValues>(
        item: IReferencePageComponent<T>,
        uriToAdd?: string,
        uriToAddMany?: string
    ) => {
        const newItem = enrichReferenceComponent(data, item, baseEngName);
        return (
            <ReferencePageComponent<T>
                setPostData={setPostData}
                key={newItem.engName}
                item={newItem}
                uriToAdd={uriToAdd ? uriToAdd : API.managementCompany.reference[baseEngName].add}
                uriToAddMany={uriToAddMany ? uriToAddMany : API.managementCompany.reference[baseEngName].addMany}
                additionalSelectorOptions={data.additionalData}
                {...getAdditionalFormData()}
            />
        );
    };

    return (
        <>
            {engName === "house" && createComponent<IHouseReferenceDataItem>(housePageComponent)}
            {engName === "apartment" && createComponent<IApartmentReferenceDataItem>(apartmentPageComponent)}
            {engName === "subscriber" && createComponent<ISubscriberReferenceDataItem>(subscriberPageComponent)}
            {engName === "individualMeter" && createComponent<IIndividualMeterReferenceDataItem>(individualMeterPageComponent)}
            {engName === "generalMeter" && createComponent<IGeneralMeterReferenceDataItem>(generalMeterPageComponent)}
            {engName === "municipalTariff" && createComponent<IMunicipalTariffReferenceDataItem>(municipalTariffPageComponent)}
            {engName === "norm" && createComponent<INormReferenceDataItem>(normPageComponent)}
            {engName === "socialNorm" && createComponent<ISocialNormReferenceDataItem>(socialNormPageComponent)}
            {engName === "seasonalityFactor" && createComponent<ISeasonalityFactorReferenceDataItem>(seasonalityFactorPageComponent)}
            {engName === "commonHouseNeedTariff" && createComponent<ICommonHouseNeedTariffReferenceDataItem>(сommonHouseNeedTariffPageComponent)}
            {engName === "penaltyRule" && createComponent<IPenaltyCalculationRuleReferenceDataItem>(
                penaltyCalcRulePageComponent,
                API.managementCompany.correction.penaltyRule.add,
                API.managementCompany.correction.penaltyRule.addMany
            )}
            {engName === "user" && createComponent<IUserReferenceDataItem>(
                ownerPageComponent,
                API.common.user.add,
                API.common.user.addMany
            )}
        </>
    );
}

export default withLayout(ReferencePage);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const url = context.resolvedUrl || "";
        const engName = url.split("/")[3];

        let apiUrl: string = '';
        let additionalData: Record<string, string | number> = {};
        switch (engName) {
            case "owner":
                apiUrl = API.common.user.get;
                break;
            case "individual-meter":
                additionalData = {
                    "meterType": MeterType.Individual
                };
                apiUrl = API.reference["meter"].get;
                break;
            case "general-meter":
                additionalData = {
                    "meterType": MeterType.General
                };
                apiUrl = API.reference["meter"].get;
                break;
            case "norm":
            case "social-norm":
            case "seasonality-factor":
            case "common-house-need-tariff":
            case "municipal-tariff": {
                apiUrl = API.reference["tariffAndNorm"].get;
                break;
            }
            case "penalty-rule": {
                apiUrl = API.managementCompany.correction["penaltyRule"].get;
                break;
            }
            default:
                apiUrl = API.reference[engName].get;
        }

        switch (engName) {
            case "house":
                return await fetchReferenceData<IHouseReferenceData>(context, apiUrl, { "isAllInfo": true });
            case "apartment":
                try {
                    const { props: houseProps } = await fetchReferenceData<{ houses: IGetHouse[] }>(context, API.reference.house.get,
                        { "isAllInfo": true }
                    );
                    const { props: apartmentProps } = await fetchReferenceData<IApartmentReferenceData>(context, apiUrl, undefined);
                    if (!apartmentProps || !houseProps) {
                        return {
                            notFound: true
                        };
                    }
                    return {
                        props: {
                            data: {
                                apartments: apartmentProps.data.apartments,
                                additionalData: [{
                                    data: houseProps.data.houses,
                                    id: 'houseId'
                                }]
                            }
                        }
                    };
                } catch {
                    return {
                        notFound: true
                    };
                }
            case "subscriber":
                try {
                    const { props: apartmentProps } = await fetchReferenceData<{ apartments: IGetApartment[] }>(context, API.reference.apartment.get,
                        { "isAllInfo": false }
                    );
                    const { props: ownerProps } = await fetchReferenceData<{ profiles: IUser[] }>(context, API.common.user.getAll, { "userRole": UserRole.Owner });
                    const { props: subscriberProps } = await fetchReferenceData<ISubscriberReferenceData>(context, apiUrl, undefined);
                    if (!subscriberProps || !apartmentProps || !ownerProps) {
                        return {
                            notFound: true
                        };
                    }
                    return {
                        props: {
                            data: {
                                subscribers: subscriberProps.data.subscribers,
                                additionalData: [{
                                    data: apartmentProps.data.apartments,
                                    id: 'apartmentId'
                                },
                                {
                                    data: ownerProps.data.profiles,
                                    id: 'ownerId'
                                }]
                            }
                        }
                    };
                } catch {
                    return {
                        notFound: true
                    };
                }
            case "owner":
                return await fetchReferenceData<IUserReferenceData>(context, apiUrl, undefined);
            case "individual-meter":
                try {
                    const { props: meterProps } = await fetchReferenceData<IIndividualMeterReferenceData>(context, apiUrl, additionalData);
                    const { props: apartmentProps } = await fetchReferenceData<{ apartments: IGetApartment[] }>(context, API.reference.apartment.get,
                        { "isAllInfo": false }
                    );
                    const { props: typeOfServiceProps } = await fetchReferenceData<{ typesOfService: ITypeOfService[] }>(
                        context, API.reference.typeOfService.get, undefined
                    );
                    if (!apartmentProps || !meterProps || !typeOfServiceProps) {
                        return {
                            notFound: true
                        };
                    }
                    return {
                        props: {
                            data: {
                                meters: meterProps.data.meters,
                                additionalData: [{
                                    data: typeOfServiceProps.data.typesOfService,
                                    id: 'typeOfServiceId'
                                },
                                {
                                    data: apartmentProps.data.apartments,
                                    id: 'apartmentId'
                                }]
                            }
                        }
                    };
                } catch {
                    return {
                        notFound: true
                    };
                }
            case "general-meter":
                try {
                    const { props: meterProps } = await fetchReferenceData<IGeneralMeterReferenceData>(context, apiUrl, additionalData);
                    const { props: houseProps } = await fetchReferenceData<{ houses: IGetHouse[] }>(context, API.reference.house.get,
                        { "isAllInfo": true }
                    );
                    const { props: typeOfServiceProps } = await fetchReferenceData<{ typesOfService: ITypeOfService[] }>(
                        context, API.reference.typeOfService.get, undefined
                    );
                    if (!houseProps || !meterProps || !typeOfServiceProps) {
                        return {
                            notFound: true
                        };
                    }
                    return {
                        props: {
                            data: {
                                meters: meterProps.data.meters,
                                additionalData: [{
                                    data: typeOfServiceProps.data.typesOfService,
                                    id: 'typeOfServiceId'
                                },
                                {
                                    data: houseProps.data.houses,
                                    id: 'houseId'
                                }]
                            }
                        }
                    };
                } catch {
                    return {
                        notFound: true
                    };
                }
            case "municipal-tariff":
                return await fetchTariffAndNormData(context, apiUrl, TariffAndNormType.MunicipalTariff);
            case "norm":
                return await fetchTariffAndNormData(context, apiUrl, TariffAndNormType.Norm);
            case "social-norm":
                return await fetchTariffAndNormData(context, apiUrl, TariffAndNormType.SocialNorm);
            case "seasonality-factor":
                return await fetchTariffAndNormData(context, apiUrl, TariffAndNormType.SeasonalityFactor, true);
            case "common-house-need-tariff":
                return await fetchTariffAndNormData(context, apiUrl, TariffAndNormType.CommonHouseNeedTariff, false, true);
            case "penalty-rule":
                return await fetchReferenceData<IPenaltyCalculationRuleReferenceData>(context, apiUrl, undefined);
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

const fetchTariffAndNormData = async (
    context: GetServerSidePropsContext,
    apiUrl: string,
    type: TariffAndNormType,
    isNotUnit?: boolean,
    isHouse?: boolean
) => {
    try {
        const { props: tariffAndNormProps } = await fetchReferenceData<IBaseTariffAndNormReferenceData>(
            context,
            apiUrl,
            { type }
        );

        const additionalData: {
            data: any[];
            id: string;
        }[] = [];

        if (isHouse) {
            const { props: houseProps } = await fetchReferenceData<{ houses: IGetHouse[] }>(
                context,
                API.reference.house.get,
                { isAllInfo: true }
            );

            additionalData.push({
                data: houseProps?.data.houses || [],
                id: 'houseId',
            });
        }
        if (!isNotUnit) {
            const { props: commonProps } = await fetchReferenceData<IGetCommon>(
                context,
                API.reference.common.get,
                undefined
            );

            additionalData.push({
                data: commonProps?.data.typesOfService || [],
                id: 'typeOfServiceId',
            });
            additionalData.push({
                data: commonProps?.data.units || [],
                id: 'unitId',
            });
        } else {
            const { props: typeOfServiceProps } = await fetchReferenceData<{ typesOfService: ITypeOfService[] }>(
                context,
                API.reference.typeOfService.get,
                undefined
            );

            additionalData.push({
                data: typeOfServiceProps?.data.typesOfService || [],
                id: 'typeOfServiceId',
            });
        }

        if (!tariffAndNormProps) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                data: {
                    tariffAndNorms: tariffAndNormProps.data.tariffAndNorms,
                    additionalData,
                },
            },
        };
    } catch {
        return {
            notFound: true,
        };
    }
};


interface ReferencePageProps extends Record<string, unknown>, IAppContext {
    data: IReferenceData & { additionalData: { data: Record<string, string | number>[]; id: string }[] };
}