import { IChat } from "@/interfaces/chat.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ChatProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    chats: IChat[];
}