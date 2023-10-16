export interface IVoting {
    id?: number;
    houseId: number;
    title: string;
    createdAt: Date;
    expiredAt: Date;
    status: VotingStatus;
}

export enum VotingStatus {
    Open = 'Открыт',
    Close = 'Закрыт'
}