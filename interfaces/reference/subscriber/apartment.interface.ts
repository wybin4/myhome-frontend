import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../page.interface";

export interface IApartmentReferenceData extends IReferenceData {
    apartments: IApartmentReferenceDataItem[];
}

export interface IApartmentReferenceDataItem extends IReferenceDataItem {
    city: string;
    street: string;
    houseNumber: string;
    livingArea: number;
    noLivingArea: number;
    commonArea: number;
    houseName: string;
}

export interface IApartment {
    id: number;
    houseId: number;
    apartmentNumber: number;
    totalArea: number;
    livingArea: number;
    numberOfRegistered: number;
}

export const apartmentPageComponent: IReferencePageComponent<IApartmentReferenceDataItem> = {
    engName: "apartment",
    rusName: [{ word: "жилое", isChangeable: true }, { word: "помещение", isChangeable: true }],
    gender: "средний",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "д. 98" },
                { value: 2, text: "д. 99" },
                { value: 3, text: "д. 100" },
            ],
            title: [{ word: "дом", isChangeable: true }], numberInOrder: 1, id: "houseName", gender: "мужской", isFilter: true,
            filterItems: [{ items: [] }],
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "квартира", isChangeable: true }], numberInOrder: 2, id: "apartmentNumber", gender: "женский", isFilter: true,
            filterItems: [{ items: [] }],
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "жил." }, { word: "площадь" }],
            numberInOrder: 3, id: "totalArea", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "общ.", }, { word: "площадь" }],
            numberInOrder: 4, id: "livingArea", gender: "женский",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "колич.", }, { word: "зарег" }],
            numberInOrder: 5, id: "numberOfRegistered", gender: "женский",
            rows: []
        },
    ]
};