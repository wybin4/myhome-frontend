import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

export interface IPenaltyCalculationRuleReferenceData extends IReferenceData {
    subscribers: IPenaltyCalculationRuleReferenceDataItem[];
}

export interface IPenaltyCalculationRuleReferenceDataItem extends IReferenceDataItem {
    name?: string;
    email: string;
    passwordHash: string;
    checkingAcount?: string;
}

export const penaltyCalcRulePageComponent: IReferencePageComponent<IPenaltyCalculationRuleReferenceDataItem> = {
    engName: "penalty-rule",
    rusName: [{ word: "настройка", isChangeable: true }, { word: "пени" }],
    gender: "женский",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 1, id: "typeOfServiceIds", gender: "женский",
            isFilter: true, filterItems: [
                { items: ["ХВС", "ГВС", "Отопление"] },
            ]
        },
        {
            type: "select", selectorOptions: [
                { value: "34234fds324", text: "C 31 дня просрочки 1/300 ставки; С 91 дня 1/130 ставки" },
                { value: "32234fds324", text: "С 1 дня просрочки 1/300 ставки" },
                { value: "32145fds324", text: "Не начисляется" },
            ],
            title: [{ word: "правило" }], numberInOrder: 2, id: "penaltyRuleId", gender: "средний",
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "приоритет" }], gender: "мужской",
            numberInOrder: 3, id: "priority"
        },
    ]
};