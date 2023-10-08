import { IReferenceData, IReferenceDataItem, IReferencePageComponent, IReferencePageItem } from "./page.interface";

export interface IBaseTariffAndNormReferenceDataItem extends IReferenceDataItem {
    id: number;
    managementCompanyId: number;
    typeOfServiceId: number;
    typeOfServiceName: string;
}

export enum TypeOfNorm { Individual = 'Individual', General = 'General' }

export interface INormReferenceData extends IReferenceData {
    norms: INormReferenceDataItem[];
}

export interface INormReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    unitName: string;
    norm: number;
    typeOfNorm: TypeOfNorm;
}

export interface IMunicipalTariffReferenceData extends IReferenceData {
    municipalTariffs: IMunicipalTariffReferenceDataItem[];
}

export interface IMunicipalTariffReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    unitName: string;
    norm: number;
    supernorm?: number;
    multiplyingFactor?: number;
}

export interface ISocialNormReferenceData extends IReferenceData {
    socialNorms: ISocialNormReferenceDataItem[];
}

export interface ISocialNormReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    unitName: string;
    norm: number;
    amount: number;
}

export interface ISeasonalityFactorReferenceData extends IReferenceData {
    seasonalityFactors: ISeasonalityFactorReferenceDataItem[];
}

export interface ISeasonalityFactorReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    monthName: string;
    coefficient: number;
}

export interface ICommonHouseNeedTariffReferenceData extends IReferenceData {
    commonHouseNeedTariffs: ICommonHouseNeedTariffReferenceDataItem[];
}

export interface ICommonHouseNeedTariffReferenceDataItem extends IReferenceDataItem {
    id: number;
    typeOfServiceId: number;
    unitId: number;
    unitName: string;
    multiplier: number;
    houseId: number;
}

export type TariffAndNormReferenceType = INormReferenceDataItem
    | ISocialNormReferenceData | ISeasonalityFactorReferenceData
    | ICommonHouseNeedTariffReferenceData | IMunicipalTariffReferenceData;


const baseTariffAndNormPageComponents: IReferencePageItem<IBaseTariffAndNormReferenceDataItem>[] = [
    {
        type: "select", selectorOptions: [
            { value: 1, text: "ХВС" },
            { value: 2, text: "ГВС" },
            { value: 3, text: "Отопление" },
        ],
        title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceName", gender: "женский",
        isFilter: true, filterItems: [
            { items: ["ХВС", "ГВС", "Отопление"] },
        ],
        rows: []
    },
];

const baseTariffAndNormWithUnitPageComponents: IReferencePageItem<(IBaseTariffAndNormReferenceDataItem & { unitId: number })>[] = [
    {
        type: "select", selectorOptions: [
            { value: 1, text: "ХВС" },
            { value: 2, text: "ГВС" },
            { value: 3, text: "Отопление" },
        ],
        title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceName", gender: "женский",
        isFilter: true, filterItems: [
            { items: [] },
        ],
        rows: []
    },
    {
        type: "select", selectorOptions: [],
        title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 4, id: "unitName", gender: "женский",
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
            type: "select", selectorOptions: [
                { value: TypeOfNorm.Individual, text: "Индивидуальная" },
                { value: TypeOfNorm.General, text: "Общедомовая" },
            ],
            title: [{ word: "тип" }, { word: "нормы" }], numberInOrder: 3, id: "typeOfNorm", gender: "мужской",
            rows: []
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
                { value: 1, text: "Январь" },
                { value: 2, text: "Февраль" },
                { value: 3, text: "Март" },
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
            type: "select", selectorOptions: [
                { value: 1, text: "д. 98" },
                { value: 2, text: "д. 99" },
            ],
            title: [{ word: "дом" }], numberInOrder: 2, id: "houseName", gender: "мужской",
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