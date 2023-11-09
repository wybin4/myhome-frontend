export interface IAppeal {
    id?: number;
    managementCompanyId: number;
    typeOfAppeal: AppealType;
    subscriberId: number;
    createdAt: Date;
    status: AppealStatus;
    data: string;

    text?: string;

    meterId?: number;
    verifiedAt?: Date;
    attachment?: string;

    typeOfServiceId?: number;
    apartmentId?: number;
    factoryNumber?: string;
    issuedAt?: Date;
}

export enum AppealType {
    AddIndividualMeter = 'Добавление счётчика',
    VerifyIndividualMeter = 'Поверка счётчика',
    Claim = 'Другое',
    ProblemOrQuestion = 'Проблема или вопрос'
}

export enum AppealStatus {
    Processing = 'В обработке',
    Closed = 'Обработано',
    Rejected = 'Отклонено'
}