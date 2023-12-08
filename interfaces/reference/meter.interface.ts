import { IReferenceData, IReferenceDataItem, IReferencePageComponent, IReferencePageItem } from "./page.interface";

export interface IGetIndividualMeter {
    id: number;
    typeOfServiceId: number;
    typeOfServiceName: string;
    factoryNumber: string;
    verifiedAt: Date;
    issuedAt: Date;
    status: MeterStatus;
    apartmentId: number;
    subscriberId: number;
    address: string;
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

export enum MeterType {
    General = 'General',
    Individual = 'Individual',
}

const meterPageComponents: IReferencePageItem<
    Omit<IIndividualMeterReferenceDataItem, "apartmentId">
    | Omit<IGeneralMeterReferenceDataItem, "houseId">>[] = [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 2, id: "typeOfServiceName", sendId: "typeOfServiceId", gender: "женский",
            rows: []
        },
        {
            type: "input", inputType: "string",
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
            title: [{ word: "дата", isChangeable: true }, { word: "пред." }, { word: "показания" }],
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
            type: "select", selectorOptions: [],
            title: [{ word: "объект" }, { word: "учёта" }], numberInOrder: 1, id: "houseName", sendId: "apartmentId", gender: "мужской",
            isFilter: true, filterItems: [
                { name: [{ word: "город" }], items: [] },
                { name: [{ word: "улица" }], items: [] },
                { name: [{ word: "дом" }], items: [] },
                { name: [{ word: "квартира" }], items: [] }
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
    keyElements: { first: [3], second: 2, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "объект" }, { word: "учёта" }], numberInOrder: 1, id: "houseName", sendId: "houseId", gender: "мужской",
            isFilter: true, filterItems: [
                { name: [{ word: "город" }], items: [] },
                { name: [{ word: "улица" }], items: [] },
                { name: [{ word: "дом" }], items: [] },
                { name: [{ word: "квартира" }], items: [] }
            ],
            rows: []
        },
        ...meterPageComponents as unknown as IReferencePageItem<IGeneralMeterReferenceDataItem>[]
    ]
};