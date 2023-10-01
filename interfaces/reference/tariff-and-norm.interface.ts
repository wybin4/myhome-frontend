import { IReferencePageComponent } from "./page.interface";

export interface IBaseTariffAndNormPage {
    managementCompanyId: number;
    typeOfServiceId: number;
}

export enum TypeOfNorm { Individual = 'Individual', General = 'General' }

export interface INormPage extends IBaseTariffAndNormPage {
    unitId: number;
    norm: number;
    typeOfNorm: TypeOfNorm;
}

export interface IMunicipalTariffPage extends IBaseTariffAndNormPage {
    unitId: number;
    norm: number;
    supernorm?: number;
    multiplyingFactor?: number;
}

export interface ISocialNormPage extends IBaseTariffAndNormPage {
    unitId: number;
    norm: number;
    amount: number;
}

export interface ISeasonalityFactorPage extends IBaseTariffAndNormPage {
    monthName: string;
    coefficient: number;
}

export interface ICommonHouseNeedTariffPage {
    id?: number;
    typeOfServiceId: number;
    unitId: number;
    multiplier: number;
    houseId: number;
}

export const normPageComponent:
    IReferencePageComponent<INormPage> = {
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
            ]
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "норма", isChangeable: true }], numberInOrder: 2, id: "norm", gender: "женский"
        },
        {
            type: "select", selectorOptions: [
                { value: TypeOfNorm.Individual, text: "Индивидуальная" },
                { value: TypeOfNorm.General, text: "Общедомовая" },
            ],
            title: [{ word: "тип" }, { word: "нормы" }], numberInOrder: 2, id: "typeOfNorm", gender: "мужской"
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 3, id: "unitId", gender: "женский",
        },
    ]
};

export const socialNormPageComponent:
    IReferencePageComponent<ISocialNormPage> = {
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
            ]
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "норма", isChangeable: true }], numberInOrder: 2, id: "norm", gender: "мужской"
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "количество" }], numberInOrder: 3, id: "amount", gender: "мужской"
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 4, id: "unitId", gender: "женский",
        },
    ]
};

export const seasonalityFactorPageComponent:
    IReferencePageComponent<ISeasonalityFactorPage> = {
    engName: "seasonality-factor",
    rusName: [{ word: "коэффициент", isChangeable: true }, { word: "сезонности" } ],
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
            ]
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "Январь" },
                { value: 2, text: "Февраль" },
                { value: 3, text: "Март" },
            ],
            title: [{ word: "месяц" }], numberInOrder: 2, id: "monthName", gender: "мужской"
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "коэффициент" }], numberInOrder: 3, id: "coefficient", gender: "мужской"
        },
    ]
};

export const сommonHouseNeedTariffPageComponent:
    IReferencePageComponent<ICommonHouseNeedTariffPage> = {
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
            ]
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "тариф" }], numberInOrder: 3, id: "multiplier", gender: "мужской"
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 4, id: "unitId", gender: "женский",
        },
    ]
};

export const municipalTariffPageComponent:
    IReferencePageComponent<IMunicipalTariffPage> = {
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
            ]
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "норма", isChangeable: true }], numberInOrder: 2, id: "norm", gender: "женский"
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "тариф" }, { word: "сверх" }, { word: "нормы" }], numberInOrder: 3, id: "supernorm", gender: "мужской"
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "повышающий" }, { word: "коэфф." }], numberInOrder: 4, id: "multiplyingFactor", gender: "мужской"
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "руб./гКал" },
                { value: 2, text: "руб./м3" },
                { value: 3, text: "руб./кВтч" },
            ],
            title: [{ word: "единицы" }, { word: "измерения" }], numberInOrder: 5, id: "unitId", gender: "женский",
        },
    ]
};