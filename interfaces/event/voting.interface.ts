export interface IVoting {
    id?: number;
    houseId: number;
    title: string;
    createdAt: Date;
    expiredAt: Date;
    status: VotingStatus;
}

export interface IAddVoting {
    houseId: number;
    title: string;
    expiredAt: Date;
    options: {
        val: string; text: number
    };
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