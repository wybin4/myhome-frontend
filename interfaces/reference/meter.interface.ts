import { IReferenceData, IReferenceDataItem, IReferencePageComponent, IReferencePageItem } from "./page.interface";

export interface ISubscriberAddMeterForm {
    typeOfService: number;
    verificationDate: Date;
    dateOfPreviousReading: Date;
    previousReading: number;
}

export interface IMeterReferenceData extends IReferenceData {
    meters: IMeterReferenceDataItem[];
}

export interface IMeterReferenceDataItem extends IReferenceDataItem {
    typeOfServiceId: number;
    typeOfServiceName: string;

    factoryNumber: string;
    verifiedAt: Date;
    issuedAt: Date;
    status: MeterStatus;

    currentReading: number;
    currentReadAt: Date;
    previousReading: number;
    previousReadAt: Date;

    houseName: string;
}

export interface IIndividualMeterReferenceData extends IReferenceData {
    meters: IIndividualMeterReferenceDataItem[];
}

export interface IIndividualMeterReferenceDataItem extends IMeterReferenceDataItem {
    apartmentId: number;
}

export interface IGeneralMeterReferenceData extends IReferenceData {
    meters: IGeneralMeterReferenceDataItem[];
}

export interface IGeneralMeterReferenceDataItem extends IMeterReferenceDataItem {
    houseId: number;
}

export interface IMeterReading {
    id?: number;
    reading: number;
    readAt: Date;
}

export interface IIndividualMeterReading extends IMeterReading {
    individualMeterId: number;
}

export interface IGeneralMeterReading extends IMeterReading {
    generalMeterId: number;
}

export enum MeterStatus {
    Active = 'Active',
    Archieve = 'Archieve',
    NoPossibility = 'NoPossibility',
    NotInstall = 'NotInstall',
}

const meterPageComponents: IReferencePageItem<
    Omit<IIndividualMeterReferenceDataItem, "apartmentId">
    | Omit<IGeneralMeterReferenceDataItem, "houseId">>[] = [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 2, id: "typeOfServiceName", gender: "женский",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "заводской" }, { word: "номер" }], numberInOrder: 3, id: "factoryNumber", gender: "мужской",
            rows: []
        },
        {
            type: "datepicker",
            title: [{ word: "дата" }, { word: "поверки" }],
            numberInOrder: 4, id: "verifiedAt", gender: "мужской",
            rows: []
        },
        {
            type: "datepicker",
            title: [{ word: "дата" }, { word: "выпуска" }],
            numberInOrder: 5, id: "issuedAt", gender: "мужской",
            rows: []
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "предыдущее", isChangeable: true }, { word: "показание" }], numberInOrder: 6, id: "previousReading", gender: "средний",
            rows: []
        },
        {
            type: "datepicker",
            title: [{ word: "дата", isChangeable: true }, { word: "предыдущего" }, { word: "показания" }],
            numberInOrder: 7, id: "previousReadAt", gender: "средний",
            rows: []
        },
    ];

export const individualMeterPageComponent:
    IReferencePageComponent<IIndividualMeterReferenceDataItem> = {
    engName: "individualMeter",
    rusName: [{ word: "индивидуальный", isChangeable: true }, { word: "прибор", isChangeable: true }, { word: "учёта" }],
    gender: "мужской",
    keyElements: { first: [3], second: 2, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "кв. 12" },
                { value: 2, text: "кв. 14" },
            ],
            title: [{ word: "объект" }, { word: "учёта" }], numberInOrder: 1, id: "houseName", gender: "мужской",
            isFilter: true, filterItems: [
                { name: [{ word: "город" }], items: ["Ростов-на-Дону"] },
                { name: [{ word: "улица" }], items: ["ул. Малюгина", "пер. Соборный"] },
                { name: [{ word: "дом" }], items: ["д. 98", "д. 99"] },
                { name: [{ word: "квартира" }], items: ["кв. 12", "кв. 14"] }
            ],
            rows: []
        },
        ...meterPageComponents as unknown as IReferencePageItem<IIndividualMeterReferenceDataItem>[]
    ]
};

export const generalMeterPageComponent:
    IReferencePageComponent<IGeneralMeterReferenceDataItem> = {
    engName: "generalMeter",
    rusName: [{ word: "общедомовой", isChangeable: true }, { word: "прибор", isChangeable: true }, { word: "учёта" }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "д. 98" },
                { value: 2, text: "д. 99" },
            ],
            title: [{ word: "объект" }, { word: "учёта" }], numberInOrder: 1, id: "houseName", gender: "мужской",
            rows: []
        },
        ...meterPageComponents as unknown as IReferencePageItem<IGeneralMeterReferenceDataItem>[]
    ]
};