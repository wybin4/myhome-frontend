import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

export interface IPenaltyCalculationRuleReferenceData extends IReferenceData {
    penaltyRules: IPenaltyCalculationRuleReferenceDataItem[];
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
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceName", gender: "женский",
            isFilter: true, filterItems: [
                { items: ["ХВС", "ГВС", "Отопление"] },
            ],
            rows: []
        },
        {
            type: "select", selectorOptions: [ // ИСПРАВИТЬ
                { value: "34234fds324", text: "C 31 дня просрочки 1/300 ставки; С 91 дня 1/130 ставки" },
                { value: "32234fds324", text: "С 1 дня просрочки 1/300 ставки" },
                { value: "32145fds324", text: "Не начисляется" },
            ],
            title: [{ word: "правило" }], numberInOrder: 2, id: "description", gender: "средний",
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