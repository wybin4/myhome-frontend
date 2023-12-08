import { getEnumValueByKey } from "@/helpers/constants";
import { IReferenceData, IReferenceDataItem, IReferencePageComponent, IReferencePageItem } from "./page.interface";

export interface IBaseTariffAndNormReferenceDataItem extends IReferenceDataItem {
    id: number;
    managementCompanyId: number;
    typeOfServiceId: number;
    typeOfServiceName: string;
}

export interface IBaseTariffAndNormReferenceData extends IReferenceData {
    tariffAndNorms: IBaseTariffAndNormReferenceDataItem[];
}

export enum TypeOfNorm { Individual = 'Индивидуальная', General = 'Общедомовая' }

export enum TariffAndNormType {
    Norm = 'Norm',
    MunicipalTariff = 'MunicipalTariff',
    SocialNorm = 'SocialNorm',
    SeasonalityFactor = 'SeasonalityFactor',
    CommonHouseNeedTariff = 'CommonHouseNeedTariff',
}

export interface INormReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    unitName: string;
    norm: number;
    typeOfNorm: TypeOfNorm;
}

export interface IMunicipalTariffReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    unitName: string;
    norm: number;
    supernorm?: number;
    multiplyingFactor?: number;
}

export interface ISocialNormReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    unitName: string;
    norm: number;
    amount: number;
}
export interface ISeasonalityFactorReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    monthName: string;
    coefficient: number;
}

export interface ICommonHouseNeedTariffReferenceDataItem extends IReferenceDataItem {
    id: number;
    typeOfServiceId: number;
    unitId: number;
    unitName: string;
    multiplier: number;
    houseId: number;
}

const baseTariffAndNormPageComponents: IReferencePageItem<IBaseTariffAndNormReferenceDataItem>[] = [
    {
        type: "select", selectorOptions: [],
        title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceName", sendId: "typeOfServiceId", gender: "женский",
        isFilter: true, filterItems: [
            { items: [] },
        ],
        rows: []
    },
];

const baseTariffAndNormWithUnitPageComponents: IReferencePageItem<(IBaseTariffAndNormReferenceDataItem & { unitId: number })>[] = [
    {
        type: "select", selectorOptions: [],
        title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceName", sendId: "typeOfServiceId", gender: "женский",
        isFilter: true, filterItems: [
            { items: [] },
        ],
        rows: []
    },
    {
        type: "select", selectorOptions: [],
        title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 4, id: "unitName", sendId: "unitId", gender: "женский",
        rows: []
    },
];


export const normPageComponent:
    IReferencePageComponent<INormReferenceDataItem> = {
    engName: "norm",
    rusName: [{ word: "норматив", isChangeable: true }],
    gender: "мужской",
    keyElements: { first: [4], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "input", inputType: "number",
            title: [{ word: "норма", isChangeable: true }], numberInOrder: 2, id: "norm", gender: "женский",
            rows: []
        },
        {
            type: "select", selectorOptions: Object.keys(TypeOfNorm).map(tn => {
                return {
                    value: tn,
                    text: getEnumValueByKey(TypeOfNorm, tn)
                };
            }),
            title: [{ word: "тип" }, { word: "нормы" }], numberInOrder: 3, id: "typeOfNorm", gender: "мужской",
            rows: [], enum: TypeOfNorm
        },
        ...baseTariffAndNormWithUnitPageComponents as unknown as IReferencePageItem<INormReferenceDataItem>[]
    ]
};

export const socialNormPageComponent:
    IReferencePageComponent<ISocialNormReferenceDataItem> = {
    engName: "social-norm",
    rusName: [{ word: "социальная", isChangeable: true }, { word: "норма", isChangeable: true }],
    gender: "женский",
    keyElements: { first: [4], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "input", inputType: "number",
            title: [{ word: "норма", isChangeable: true }], numberInOrder: 2, id: "norm", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "количество" }, { word: "прописанных" }], numberInOrder: 3, id: "amount", gender: "мужской",
            rows: []
        },
        ...baseTariffAndNormWithUnitPageComponents as unknown as IReferencePageItem<ISocialNormReferenceDataItem>[]
    ]
};

export const seasonalityFactorPageComponent:
    IReferencePageComponent<ISeasonalityFactorReferenceDataItem> = {
    engName: "seasonality-factor",
    rusName: [{ word: "коэффициент", isChangeable: true }, { word: "сезонности" }],
    gender: "мужской",
    keyElements: { first: [1], second: 2, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [
                { value: "Январь", text: "Январь" },
                { value: "Февраль", text: "Февраль" },
                { value: "Март", text: "Март" },
                { value: "Апрель", text: "Апрель" },
                { value: "Май", text: "Май" },
                { value: "Июнь", text: "Июнь" },
                { value: "Июль", text: "Июль" },
                { value: "Август", text: "Август" },
                { value: "Сентябрь", text: "Сентябрь" },
                { value: "Октябрь", text: "Октябрь" },
                { value: "Ноябрь", text: "Ноябрь" },
                { value: "Декабрь", text: "Декабрь" },
            ],
            title: [{ word: "месяц" }], numberInOrder: 2, id: "monthName", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "коэффициент" }], numberInOrder: 3, id: "coefficient", gender: "мужской",
            rows: []
        },
        ...baseTariffAndNormPageComponents as unknown as IReferencePageItem<ISeasonalityFactorReferenceDataItem>[]
    ]
};

export const сommonHouseNeedTariffPageComponent:
    IReferencePageComponent<ICommonHouseNeedTariffReferenceDataItem> = {
    engName: "сommon-house-need-tariff",
    rusName: [{ word: "общедомовая", isChangeable: true }, { word: "нужда", isChangeable: true }],
    gender: "мужской",
    keyElements: { first: [2], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "дом" }], numberInOrder: 2, id: "houseName", sendId: "houseId", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "тариф" }], numberInOrder: 3, id: "multiplier", gender: "мужской",
            rows: []
        },
        ...baseTariffAndNormWithUnitPageComponents as unknown as IReferencePageItem<ICommonHouseNeedTariffReferenceDataItem>[]
    ]
};

export const municipalTariffPageComponent:
    IReferencePageComponent<IMunicipalTariffReferenceDataItem> = {
    engName: "municipal-tariff",
    rusName: [{ word: "муниципальный", isChangeable: true }, { word: "тариф", isChangeable: true }],
    gender: "мужской",
    keyElements: { first: [4], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "input", inputType: "number",
            title: [{ word: "норма", isChangeable: true }], numberInOrder: 2, id: "norm", gender: "женский",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "тариф" }, { word: "сверх" }, { word: "нормы" }], numberInOrder: 3, id: "supernorm", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "повышающий" }, { word: "коэфф." }], numberInOrder: 6, id: "multiplyingFactor", gender: "мужской",
            rows: []
        },
        ...baseTariffAndNormWithUnitPageComponents as unknown as IReferencePageItem<IMunicipalTariffReferenceDataItem>[]
    ]
};