import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../page.interface";

export interface IHouseReferenceData extends IReferenceData {
    houses: IHouseReferenceDataItem[];
}

export interface IHouseReferenceDataItem extends IReferenceDataItem {
    city: string;
    street: string;
    houseNumber: string;
    livingArea: number;
    noLivingArea: number;
    commonArea: number;
}

export interface IHouse {
    id: number;
    managementCompanyId: number;
    city: string;
    street: string;
    houseNumber: string;
    livingArea: number;
    noLivingArea: number;
    commonArea: number;
}

export interface IGetHouse extends IHouse {
    name: string;
}

export const housePageComponent: IReferencePageComponent<IHouseReferenceDataItem> = {
    engName: "house",
    rusName: [{ word: "дом", isChangeable: true }],
    gender: "мужской",
    keyElements: { first: [1, 2], second: 3 },
    components: [
        {
            type: "input",
            title: [{ word: "город", isChangeable: true }], numberInOrder: 1, id: "city", gender: "мужской",
            rows: []
        },
        {
            type: "input",
            title: [{ word: "улица", isChangeable: true }], numberInOrder: 2, id: "street", gender: "женский",
            rows: []
        },
        {
            type: "input",
            title: [{ word: "дом" }], gender: "мужской",
            numberInOrder: 3, id: "houseNumber",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "жил." }, { word: "площадь" }], gender: "женский",
            numberInOrder: 4, id: "livingArea",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "нежил." }, { word: "площадь" }], gender: "женский",
            numberInOrder: 5, id: "noLivingArea",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "общ." }, { word: "площадь" }], gender: "женский",
            numberInOrder: 6, id: "commonArea",
            rows: []
        },
    ],
    additionalGetFormData: { "isAllInfo": true }
};