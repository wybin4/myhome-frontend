import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface VotingProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    options: { text: string; id: number; }[];
    answers: number[];
    onAnswer: (answerId: number) => void;
}