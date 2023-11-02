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

export interface IOption {
    id: number;
    votingId: number;
    text: string;
    numberOfVotes: number;
    votes: IVote[];
}

export interface IVote {
    id?: number;
    optionId: number;
    userId: number;
}