import { IReferenceData, IReferenceDataItem, IReferencePageComponent } from "../reference/page.interface";

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
    votes: IVote;
}

export interface IVote {
    id?: number;
    optionId: number;
    userId: number;
}

export interface IVotingReferenceData extends IReferenceData {
    votings: IVotingReferenceDataItem[];
}

export interface IVotingReferenceDataItem extends IReferenceDataItem {
    id: number;
    title: string;
    createdAt: Date;
    expiredAt: Date;
    status: VotingStatus;
    houseName: string;
    result: string;
}

export const votingPageComponent: IReferencePageComponent<IVotingReferenceDataItem> = {
    engName: "voting",
    rusName: [{ word: "опрос", isChangeable: true }],
    gender: "мужской",
    keyElements: { first: [3], second: 1, isSecondNoNeedTitle: true },
    components: [
        {
            type: "select", selectorOptions: [],
            title: [{ word: "дом", isChangeable: true }], numberInOrder: 1, id: "name", sendId: "houseId", gender: "мужской", isFilter: true,
            filterItems: [{ items: [] }],
            rows: []
        },
        {
            type: "input-vote",
            title: [{ word: "варианты", isChangeable: true }, { word: "ответа" }], numberInOrder: 3, id: "options", gender: "мужской",
            rows: [], isInvisibleInTable: true
        },
        {
            type: "input",
            title: [{ word: "тема", isChangeable: true }, { word: "опроса" }],
            numberInOrder: 2, id: "title", gender: "женский",
            rows: []
        },
        {
            type: "datepicker",
            title: [{ word: "дата" }, { word: "окончания" }],
            numberInOrder: 4, id: "expiredAt", gender: "женский",
            rows: []
        },
    ]
};