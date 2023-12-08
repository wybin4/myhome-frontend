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
    Archieved = 'В архиве',
    Active = 'Активен'
}

export const subscriberPageComponent:
    IReferencePageComponent<ISubscriberReferenceDataItem> = {
    engName: "subscriber",
    rusName: [{ word: "лицевой", isChangeable: true }, { word: "счет", isChangeable: true }],
    gender: "мужской",
    tableActions: { actions: [{ type: "editAndSave", onClick: () => { }, id: 0 }] },
    keyElements: { first: [3], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "ФИО" }, { word: "ответств." }], numberInOrder: 1, id: "ownerName", sendId: "ownerId", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "string",
            title: [{ word: "код" }], numberInOrder: 2, id: "personalAccount", gender: "мужской",
            rows: []
        },
        {
            type: "select", selectorOptions: [],
            title: [{ word: "объект" }, { word: "учета" }],
            numberInOrder: 3, id: "apartmentName", sendId: "apartmentId", gender: "мужской",
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
            numberInOrder: 4, id: "status", gender: "женский", enum: SubscriberStatus,
            rows: []
        },
    ]
};