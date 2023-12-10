import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

export interface IPenaltyCalculationRuleReferenceData extends IReferenceData {
    penaltyRules: IPenaltyCalculationRuleReferenceDataItem[];
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

export const penaltyCalcRulePageComponent: IReferencePageComponent<IPenaltyCalculationRuleReferenceDataItem> = {
    engName: "penalty-rule",
    rusName: [{ word: "настройка", isChangeable: true }, { word: "пени" }],
    gender: "женский",
    keyElements: { first: [], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceName", sendId: "typeOfServiceId",
            gender: "женский",
            isFilter: true, filterItems: [
                { items: [] },
            ],
            rows: [], selectorType: "withoutradio"
        },
        {
            type: "select", selectorOptions: [],
            title: [{ word: "правило" }], numberInOrder: 2, id: "description", sendId: "penaltyRuleId", gender: "средний",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "приоритет" }], gender: "мужской",
            numberInOrder: 3, id: "priority",
            rows: []
        },
    ]
};