import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../page.interface";

export interface ISubscriberReferenceData extends IReferenceData {
    subscribers: ISubscriberReferenceDataItem[];
}

export interface ISubscriberReferenceDataItem extends IReferenceDataItem {
    ownerId: number;
    apartmentId: number;
    personalAccount: string;
    status: SubscriberStatus;
}

export interface ISubscriber {
    id: number;
    ownerId: number;
    apartmentId: number;
    personalAccount: string;
    status: SubscriberStatus;
}

export enum SubscriberStatus {
    Archieved = 'Archieved',
    Active = 'Active'
}

export const subscriberPageComponent:
    IReferencePageComponent<ISubscriberReferenceDataItem> = {
    engName: "subscriber",
    rusName: [{ word: "лицевой", isChangeable: true }, { word: "счет", isChangeable: true }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "А.А.А" },
                { value: 2, text: "А.А.А" },
                { value: 3, text: "А.А.А" },
            ],
            title: [{ word: "ФИО" }, { word: "ответств." }], numberInOrder: 1, id: "ownerId", gender: "мужской"
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "код" }], numberInOrder: 2, id: "personalAccount", gender: "мужской"
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "д. 98" },
                { value: 2, text: "д. 99" },
                { value: 3, text: "д. 100" },
            ],
            title: [{ word: "объект" }, { word: "учета" }],
            numberInOrder: 3, id: "apartmentId", gender: "мужской",
            isFilter: true, filterItems: [
                { name: [{ word: "город" }], items: ["Ростов-на-Дону"] },
                { name: [{ word: "улица" }], items: ["ул. Малюгина", "пер. Соборный"] },
                { name: [{ word: "дом" }], items: ["д. 98", "д. 99"] },
                { name: [{ word: "квартира" }], items: ["кв. 12", "кв. 14"] }
            ]
        },
        {
            type: "none",
            title: [{ word: "статус" }],
            numberInOrder: 4, id: "status", gender: "женский"
        },
    ]
};