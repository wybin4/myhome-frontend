import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

export interface IPenaltyCalculationRuleReferenceData extends IReferenceData {
    penaltyRules: IPenaltyCalculationRuleReferenceDataItem[];
}

export interface IPenaltyRuleReferenceData extends IReferenceData {
    penaltyRules: IPenaltyRuleReferenceDataItem[];
}

export interface IPenaltyRule {
    _id?: string;
    name: string;
}

export interface IPenaltyCalculationRuleReferenceDataItem extends IReferenceDataItem {
    penaltyRuleId: string;
    description: string;
    typeOfServiceName: string;
    typeOfServiceId: number;
    priority: number;
}

export interface IPenaltyRuleReferenceDataItem extends IReferenceDataItem {
    id: string;
    name: string;
    divider: number;
    designation: string;
    start: number;
    end: number;
}

export const penaltyCalcRulePageComponent: IReferencePageComponent<IPenaltyCalculationRuleReferenceDataItem> = {
    engName: "penalty-rule",
    rusName: [{ word: "настройка", isChangeable: true }, { word: "пени" }],
    gender: "женский",
    keyElements: { first: [], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceName", sendId: "typeOfServiceId",
            gender: "женский", isNotFilter: true,
            rows: [], selectorType: "withoutradio"
        },
        {
            type: "select", selectorOptions: [],
            title: [{ word: "правило" }], numberInOrder: 2, id: "description", sendId: "penaltyRuleId", gender: "средний",
            rows: [], isNotFilter: true
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "приоритет" }], gender: "мужской",
            numberInOrder: 3, id: "priority",
            rows: []
        },
    ]
};

export const penaltyRulePageComponent: IReferencePageComponent<IPenaltyRuleReferenceDataItem> = {
    engName: "penalty-rule",
    rusName: [{ word: "правило" }, { word: "расчёта" }, { word: "пени" }],
    gender: "женский",
    keyElements: { first: [], second: 4, isSecondNoNeedTitle: true },
    components: [
        {
            type: "input", inputType: "number",
            title: [{ word: "делитель" }], gender: "мужской",
            numberInOrder: 1, id: "designation", sendId: "divider",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "начало" }], gender: "средний",
            numberInOrder: 2, id: "start",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "окончание" }], gender: "средний",
            numberInOrder: 3, id: "end",
            rows: []
        },
        {
            type: "textarea",
            title: [{ word: "описание" }], gender: "средний",
            numberInOrder: 4, id: "name", sendId: "description",
            rows: []
        },
    ]
};