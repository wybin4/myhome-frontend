import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface VotingProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    options: { text: string; id: number; numberOfVotes: number; }[];
    onAnswer: (answerId: number) => void;
    activeId: number;
}