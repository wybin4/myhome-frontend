import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "./page.interface";

export interface IBaseTariffAndNormReferenceData extends IReferenceData {
    subscribers: IBaseTariffAndNormReferenceDataItem[];
}

export interface IBaseTariffAndNormReferenceDataItem extends IReferenceDataItem {
    managementCompanyId: number;
    typeOfServiceId: number;
}

export enum TypeOfNorm { Individual = 'Individual', General = 'General' }

export interface INormReferenceData extends IReferenceData {
    norms: INormReferenceDataItem[];
}

export interface INormReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    norm: number;
    typeOfNorm: TypeOfNorm;
}

export interface IMunicipalTariffReferenceData extends IReferenceData {
    municipalTariffs: IMunicipalTariffReferenceDataItem[];
}

export interface IMunicipalTariffReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
    norm: number;
    supernorm?: number;
    multiplyingFactor?: number;
}

export interface ISocialNormReferenceData extends IReferenceData {
    socialNorms: ISocialNormReferenceDataItem[];
}

export interface ISocialNormReferenceDataItem extends IBaseTariffAndNormReferenceDataItem {
    unitId: number;
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
    multiplier: number;
    houseId: number;
}

export const normPageComponent:
    IReferencePageComponent<INormReferenceDataItem> = {
    engName: "norm",
    rusName: [{ word: "норматив", isChangeable: true }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceId", gender: "женский",
            isFilter: true, filterItems: [
                { items: ["ХВС", "ГВС", "Отопление"] },
            ],
            rows: []
        },
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
            title: [{ word: "тип" }, { word: "нормы" }], numberInOrder: 2, id: "typeOfNorm", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 3, id: "unitId", gender: "женский",
            rows: []
        },
    ]
};

export const socialNormPageComponent:
    IReferencePageComponent<ISocialNormReferenceDataItem> = {
    engName: "social-norm",
    rusName: [{ word: "социальная", isChangeable: true }, { word: "норма", isChangeable: true }],
    gender: "женский",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceId", gender: "женский",
            isFilter: true, filterItems: [
                { items: ["ХВС", "ГВС", "Отопление"] },
            ],
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "норма", isChangeable: true }], numberInOrder: 2, id: "norm", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "количество" }], numberInOrder: 3, id: "amount", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 4, id: "unitId", gender: "женский",
            rows: []
        },
    ]
};

export const seasonalityFactorPageComponent:
    IReferencePageComponent<ISeasonalityFactorReferenceDataItem> = {
    engName: "seasonality-factor",
    rusName: [{ word: "коэффициент", isChangeable: true }, { word: "сезонности" }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceId", gender: "женский",
            isFilter: true, filterItems: [
                { items: ["ХВС", "ГВС", "Отопление"] },
            ],
            rows: []
        },
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
    ]
};

export const сommonHouseNeedTariffPageComponent:
    IReferencePageComponent<ICommonHouseNeedTariffReferenceDataItem> = {
    engName: "сommon-house-need-tariff",
    rusName: [{ word: "общедомовая", isChangeable: true }, { word: "нужда", isChangeable: true }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "д. 98" },
                { value: 2, text: "д. 99" },
            ],
            title: [{ word: "дом" }], numberInOrder: 1, id: "houseId", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 2, id: "typeOfServiceId", gender: "женский",
            isFilter: true, filterItems: [
                { items: ["ХВС", "ГВС", "Отопление"] },
            ],
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "тариф" }], numberInOrder: 3, id: "multiplier", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 4, id: "unitId", gender: "женский",
            rows: []
        },
    ]
};

export const municipalTariffPageComponent:
    IReferencePageComponent<IMunicipalTariffReferenceDataItem> = {
    engName: "municipal-tariff",
    rusName: [{ word: "муниципальный", isChangeable: true }, { word: "тариф", isChangeable: true }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceId", gender: "женский",
            isFilter: true, filterItems: [
                { items: ["ХВС", "ГВС", "Отопление"] },
            ],
            rows: []
        },
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
            title: [{ word: "повышающий" }, { word: "коэфф." }], numberInOrder: 4, id: "multiplyingFactor", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 5, id: "unitId", gender: "женский",
            rows: []
        },
    ]
};