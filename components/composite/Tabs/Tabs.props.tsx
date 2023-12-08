import { DetailedHTMLProps, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from "react";

export interface TabsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    tabs: { name: string; id: number; }[];
    tagTexts?: string[];
    descriptionText?: string;

    onAddButtonClick?: () => void;

    activeTab: number;
    setActiveTab: Dispatch<SetStateAction<number>>;
    
    children: ReactNode;
    isData: boolean;
}