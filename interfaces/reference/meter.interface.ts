import { IReferencePageComponent, IReferencePageItem } from "./page.interface";

export interface ISubscriberAddMeterForm {
    typeOfService: number;
    verificationDate: Date;
    dateOfPreviousReading: Date;
    previousReading: number;
}

export interface IMeterPage {
    typeOfServiceId: number;
    factoryNumber: string;
    verifiedAt: Date;
    issuedAt: Date;
    status: MeterStatus;
    previousReading: number;
    previousReadAt: Date;
}

export interface IIndividualMeterPage extends IMeterPage {
    apartmentId: number;
}

export interface IGeneralMeterPage extends IMeterPage {
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
    Omit<IIndividualMeterPage, "apartmentId">
    | Omit<IIndividualMeterPage, "houseId">>[] = [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "ХВС" },
                { value: 2, text: "ГВС" },
                { value: 3, text: "Отопление" },
            ],
            title: [{ word: "тип" }, { word: "услуги" }], numberInOrder: 2, id: "typeOfServiceId", gender: "женский",
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "заводской" }, { word: "номер" }], numberInOrder: 3, id: "factoryNumber", gender: "мужской"
        },
        {
            type: "datepicker",
            title: [{ word: "дата" }, { word: "поверки" }],
            numberInOrder: 4, id: "verifiedAt", gender: "мужской",
        },
        {
            type: "datepicker",
            title: [{ word: "дата" }, { word: "выпуска" }],
            numberInOrder: 5, id: "issuedAt", gender: "мужской",
        },
        {
            type: "input", inputType: "number",
            title: [{ word: "предыдущее", isChangeable: true }, { word: "показание" }], numberInOrder: 6, id: "previousReading", gender: "средний"
        },
        {
            type: "datepicker",
            title: [{ word: "дата", isChangeable: true }, { word: "предыдущего" }, { word: "показания" }],
            numberInOrder: 7, id: "previousReadAt", gender: "средний",
        },
    ];

export const individualMeterPageComponent:
    IReferencePageComponent<IIndividualMeterPage> = {
    engName: "individual-meter",
    rusName: [{ word: "индивидуальный", isChangeable: true }, { word: "прибор", isChangeable: true }, { word: "учёта" }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "кв. 12" },
                { value: 2, text: "кв. 14" },
            ],
            title: [{ word: "объект" }, { word: "учёта" }], numberInOrder: 1, id: "apartmentId", gender: "мужской",
            isFilter: true, filterItems: [
                { name: [{ word: "город" }], items: ["Ростов-на-Дону"] },
                { name: [{ word: "улица" }], items: ["ул. Малюгина", "пер. Соборный"] },
                { name: [{ word: "дом" }], items: ["д. 98", "д. 99"] },
                { name: [{ word: "квартира" }], items: ["кв. 12", "кв. 14"] }
            ]
        },
        ...meterPageComponents as unknown as IReferencePageItem<IIndividualMeterPage>[]
    ]
};

export const generalMeterPageComponent:
    IReferencePageComponent<IGeneralMeterPage> = {
    engName: "general-meter",
    rusName: [{ word: "общедомовой", isChangeable: true }, { word: "прибор", isChangeable: true }, { word: "учёта" }],
    gender: "мужской",
    components: [
        {
            type: "select", selectorOptions: [
                { value: 1, text: "д. 98" },
                { value: 2, text: "д. 99" },
            ],
            title: [{ word: "объект" }, { word: "учёта" }], numberInOrder: 1, id: "houseId", gender: "мужской",
        },
        ...meterPageComponents as unknown as IReferencePageItem<IGeneralMeterPage>[]
    ]
};