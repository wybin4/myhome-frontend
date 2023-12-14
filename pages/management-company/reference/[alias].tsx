/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { PAGE_LIMIT } from "@/helpers/constants";
import { enrichReferenceComponent, fetchReferenceData, handleFilter, handleFilterDateClick, handleSearch } from "@/helpers/reference-constants";
import { IUser, IUserReferenceData, IUserReferenceDataItem, UserRole, ownerPageComponent } from "@/interfaces/account/user.interface";
import { IGetCommon, ITypeOfService } from "@/interfaces/common.interface";
import { IPenaltyCalculationRuleReferenceData, IPenaltyCalculationRuleReferenceDataItem, IPenaltyRule, penaltyCalcRulePageComponent } from "@/interfaces/correction/penalty.interface";
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
import { getPagination } from "../reference-helper";
import { IFilter, ISearch } from "@/interfaces/meta.interface";
import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";

function ReferencePage({ data: initialData }: ReferencePageProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [engName, setEngName] = useState<string>("");
    const [baseEngName, setBaseEngName] = useState<string>("");
    const router = useRouter();
    const [itemOffset, setItemOffset] = useState(0);
    const [filters, setFilters] = useState<IFilter[]>();
    const [search, setSearch] = useState<ISearch>();

    const getAdditionalFormData = (): { additionalFormData: Record<string, string | number> } | undefined => {
        switch (engName) {
            case "individualMeter":
                return { additionalFormData: { "meterType": MeterType.Individual } };
            case "generalMeter":
                return { additionalFormData: { "meterType": MeterType.General } };
            case "socialNorm":
                return { additionalFormData: { "type": TariffAndNormType.SocialNorm } };
            case "norm":
                return { additionalFormData: { "type": TariffAndNormType.Norm } };
            case "seasonalityFactor":
                return { additionalFormData: { "type": TariffAndNormType.SeasonalityFactor } };
            case "municipalTariff":
                return { additionalFormData: { "type": TariffAndNormType.MunicipalTariff } };
            case "commonHouseNeedTariff":
                return { additionalFormData: { "type": TariffAndNormType.CommonHouseNeedTariff } };
            case "profile":
                return { additionalFormData: { "userRole": UserRole.Owner } };
        }
        return undefined;
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
                baseEngName = "profile";
                engName = "profile";
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

    const setPostData = (newData: any, isNew?: boolean, isGet?: boolean) => {
        const name = baseEngName + "s";
        const newArr = newData[name];

        if (!isGet) {
            setData(prevData => {
                const newTotalCount = data.totalCount ? data.totalCount + 1 : 1;
                if (name in prevData) {
                    const newDataArray = [...prevData[name], ...newArr];
                    return { ...prevData, [name]: newDataArray, totalCount: newTotalCount } as IReferenceData & {
                        additionalData: {
                            data: Record<string, string | number>[];
                            id: string;
                        }[];
                        totalCount?: number;
                    };
                } else {
                    const newDataArray = [...newArr];
                    return { ...prevData, [name]: newDataArray } as IReferenceData & {
                        additionalData: {
                            data: Record<string, string | number>[];
                            id: string;
                        }[];
                        totalCount?: number;
                    };
                }
            });
        } else {
            const newTotalCount = newData.totalCount;
            if (!isNew) {
                setData((prevData) => {
                    const newDataArray = [...prevData[name], ...newArr];
                    return { ...prevData, [name]: newDataArray, totalCount: newTotalCount };
                });
            } else {
                setData(prevData => {
                    const newDataArray = [...newArr || []];
                    return { ...prevData, [name]: newDataArray, totalCount: newTotalCount };
                });
            }
        }
    };

    const createComponent = <T extends FieldValues>(
        item: IReferencePageComponent<T>,
        uriToAdd?: string,
        uriToGet?: string
    ) => {
        const endOffset = itemOffset + PAGE_LIMIT;
        const newItem = enrichReferenceComponent(data, item, baseEngName, itemOffset, endOffset);
        const linkToGet = uriToGet ? uriToGet : API.reference[baseEngName].get;

        return (
            <>
                <ReferencePageComponent<T>
                    setPostData={setPostData}
                    key={newItem.engName}
                    item={newItem}
                    uriToAdd={uriToAdd ? uriToAdd : API.managementCompany.reference[baseEngName].addMany}
                    additionalSelectorOptions={data.additionalData}
                    entityName={baseEngName}
                    isData={initialData.totalCount !== null || data.totalCount !== 0}
                    handleFilter={async (value: string[], id: string) => {
                        await handleFilter(
                            value, id,
                            linkToGet, item.additionalGetFormData, setPostData,
                            setItemOffset, filters, setFilters, search
                        );
                    }}
                    handleFilterDate={async (value: IBaseDateRange | undefined, id: string) => {
                        await handleFilterDateClick(
                            value, id,
                            linkToGet, item.additionalGetFormData, setPostData,
                            setItemOffset, filters, setFilters, search
                        );
                    }}
                    handleSearch={async (value: string, id: string) => {
                        await handleSearch(
                            value, id,
                            linkToGet, item.additionalGetFormData, setPostData,
                            setItemOffset, setSearch, filters
                        );
                    }}
                    {...getAdditionalFormData()}
                />
                {getPagination(
                    setItemOffset, data, initialData, baseEngName + "s",
                    linkToGet, item.additionalGetFormData, setPostData,
                    search, filters
                )}
            </>

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
                API.managementCompany.correction.penaltyRule.addMany,
                API.managementCompany.correction.penaltyRule.get,
            )}
            {engName === "profile" && createComponent<IUserReferenceDataItem>(
                ownerPageComponent,
                API.common.user.addMany,
                API.common.user.getAll
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
        switch (engName) {
            case "owner":
                apiUrl = API.common.user.getAll;
                break;
            case "individual-meter":
                apiUrl = API.reference.meter.get;
                break;
            case "general-meter":
                apiUrl = API.reference.meter.get;
                break;
            case "norm":
            case "social-norm":
            case "seasonality-factor":
            case "common-house-need-tariff":
            case "municipal-tariff": {
                apiUrl = API.reference.tariffAndNorm.get;
                break;
            }
            case "penalty-rule": {
                apiUrl = API.managementCompany.correction.penaltyRule.get;
                break;
            }
            default:
                apiUrl = API.reference[engName].get;
        }

        switch (engName) {
            case "house":
                return await fetchReferenceData<IHouseReferenceData>(context, apiUrl,
                    housePageComponent.additionalGetFormData, true
                );
            case "apartment":
                try {
                    const { props: houseProps } = await fetchReferenceData<{ houses: IGetHouse[] }>(context, API.reference.house.get,
                        { "isAllInfo": true }
                    );
                    const { props: apartmentProps } = await fetchReferenceData<IApartmentReferenceData>(context, apiUrl, undefined, true);
                    if (!apartmentProps || !houseProps) {
                        return {
                            notFound: true
                        };
                    }
                    return {
                        props: {
                            data: {
                                apartments: ('apartments' in apartmentProps.data) ? apartmentProps.data.apartments : [],
                                additionalData: [{
                                    data: ('houses' in houseProps.data) ? houseProps.data.houses : [],
                                    id: 'houseId'
                                }],
                                totalCount: ('totalCount' in apartmentProps.data) ? apartmentProps.data.totalCount : null,
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
                        apartmentPageComponent.additionalGetFormData
                    );
                    const { props: ownerProps } = await fetchReferenceData<{ profiles: IUser[] }>(context, API.common.user.getAll, { "userRole": UserRole.Owner });
                    const { props: subscriberProps } = await fetchReferenceData<ISubscriberReferenceData>(context, apiUrl, undefined, true);
                    if (!subscriberProps || !apartmentProps || !ownerProps) {
                        return {
                            notFound: true
                        };
                    }
                    return {
                        props: {
                            data: {
                                subscribers: ('subscribers' in subscriberProps.data) ? subscriberProps.data.subscribers : [],
                                additionalData: [{
                                    data: ('apartments' in apartmentProps.data) ? apartmentProps.data.apartments : [],
                                    id: 'apartmentId'
                                },
                                {
                                    data: ('profiles' in ownerProps.data) ? ownerProps.data.profiles : [],
                                    id: 'ownerId'
                                }],
                            }
                        }
                    };
                } catch {
                    return {
                        notFound: true
                    };
                }
            case "owner":
                return await fetchReferenceData<IUserReferenceData>(context, apiUrl, ownerPageComponent.additionalGetFormData, true);
            case "individual-meter":
                try {
                    const { props: meterProps } = await fetchReferenceData<IIndividualMeterReferenceData>(context, apiUrl,
                        individualMeterPageComponent.additionalGetFormData, true
                    );
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
                                meters: ('meters' in meterProps.data) ? meterProps.data.meters : [],
                                additionalData: [{
                                    data: ('typesOfService' in typeOfServiceProps.data) ? typeOfServiceProps.data.typesOfService : [],
                                    id: 'typeOfServiceId'
                                },
                                {
                                    data: ('apartments' in apartmentProps.data) ? apartmentProps.data.apartments : [],
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
                    const { props: meterProps } = await fetchReferenceData<IGeneralMeterReferenceData>(context, apiUrl,
                        generalMeterPageComponent.additionalGetFormData, true
                    );
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
                                meters: ('meters' in meterProps.data) ? meterProps.data.meters : [],
                                additionalData: [{
                                    data: ('typesOfService' in typeOfServiceProps.data) ? typeOfServiceProps.data.typesOfService : [],
                                    id: 'typeOfServiceId'
                                },
                                {
                                    data: ('houses' in houseProps.data) ? houseProps.data.houses : [],
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
                try {
                    const { props: penaltyCalcRuleProps } = await fetchReferenceData<IPenaltyCalculationRuleReferenceData>(context, apiUrl, undefined, true);
                    const { props: penaltyRuleProps } = await fetchReferenceData<{ penaltyRules: IPenaltyRule[] }>(context,
                        API.managementCompany.correction.penaltyRule.getMany || "",
                        undefined);

                    const { props: typeOfServiceProps } = await fetchReferenceData<{ typesOfService: ITypeOfService[] }>(
                        context, API.reference.typeOfService.get, undefined
                    );
                    if (!penaltyCalcRuleProps || !typeOfServiceProps || !penaltyRuleProps) {
                        return {
                            notFound: true
                        };
                    }

                    return {
                        props: {
                            data: {
                                penaltyRules: ('penaltyRules' in penaltyCalcRuleProps.data) ? penaltyCalcRuleProps.data.penaltyRules : [],
                                additionalData: [{
                                    data: ('typesOfService' in typeOfServiceProps.data) ? typeOfServiceProps.data.typesOfService : [],
                                    id: 'typeOfServiceId'
                                },
                                {
                                    data: ('penaltyRules' in penaltyRuleProps.data) ? penaltyRuleProps.data.penaltyRules : [],
                                    id: 'penaltyRuleId'
                                }
                                ]
                            }
                        }
                    };
                } catch {
                    return {
                        notFound: true
                    };
                }
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
            { type },
            true
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

            if (houseProps) {
                additionalData.push({
                    data: ('houses' in houseProps.data) ? houseProps.data.houses : [],
                    id: 'houseId',
                });
            }
        }
        if (!isNotUnit) {
            const { props: commonProps } = await fetchReferenceData<IGetCommon>(
                context,
                API.reference.common.get,
                undefined
            );

            if (commonProps) {
                additionalData.push({
                    data: ('typesOfService' in commonProps.data) ? commonProps.data.typesOfService : [],
                    id: 'typeOfServiceId',
                });
                additionalData.push({
                    data: ('units' in commonProps.data) ? commonProps.data.units : [],
                    id: 'unitId',
                });
            }
        } else {
            const { props: typeOfServiceProps } = await fetchReferenceData<{ typesOfService: ITypeOfService[] }>(
                context,
                API.reference.typeOfService.get,
                undefined
            );

            if (typeOfServiceProps) {
                additionalData.push({
                    data: ('typesOfService' in typeOfServiceProps.data) ? typeOfServiceProps.data.typesOfService : [],
                    id: 'typeOfServiceId',
                });
            }
        }

        if (!tariffAndNormProps) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                data: {
                    tariffAndNorms: ('tariffAndNorms' in tariffAndNormProps.data) ? tariffAndNormProps.data.tariffAndNorms : [],
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
    data: IReferenceData & {
        additionalData: {
            data: Record<string, string | number>[];
            id: string;
        }[];
        totalCount?: number;
    };
}