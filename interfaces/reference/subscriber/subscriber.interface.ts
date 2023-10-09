import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../page.interface";

export interface ISubscriberReferenceData extends IReferenceData {
    subscribers: ISubscriberReferenceDataItem[];
}

export interface ISubscriberReferenceDataItem extends IReferenceDataItem {
    id: number;

    ownerId: number;
    ownerName: string;

    apartmentId: number;
    apartmentName: string;

    houseId: number;
    houseName: string;

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
    keyElements: { first: [3], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "А.А.А" },
                { value: 2, text: "А.А.А" },
                { value: 3, text: "А.А.А" },
            ],
            title: [{ word: "ФИО" }, { word: "ответств." }], numberInOrder: 1, id: "ownerName", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "код" }], numberInOrder: 2, id: "personalAccount", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [
                { value: 1, text: "д. 98" },
                { value: 2, text: "д. 99" },
                { value: 3, text: "д. 100" },
            ],
            title: [{ word: "объект" }, { word: "учета" }],
            numberInOrder: 3, id: "apartmentName", gender: "мужской",
            isFilter: true, filterItems: [
                { name: [{ word: "город" }], items: [] },
                { name: [{ word: "улица" }], items: [] },
                { name: [{ word: "дом" }], items: [] },
                { name: [{ word: "квартира" }], items: [] }
            ],
            rows: []
        },
        {
            type: "none",
            title: [{ word: "статус" }],
            numberInOrder: 4, id: "status", gender: "женский",
            rows: []
        },
    ]
};