export interface IAppeal {
    id: number;
    managementCompanyId: number;
    typeOfAppealId: number;
    subscriberId: number;
    createdAt: Date;
    status: AppealStatus;
    data: unknown;
}

export enum AppealStatus {
    Processing = 'В обработке',
    Closed = 'Обработано',
    Rejected = 'Отклонено'
}