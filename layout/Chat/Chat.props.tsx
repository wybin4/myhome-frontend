import { UserRole } from "@/interfaces/account/user.interface";
import { IChat } from "@/interfaces/chat.interface";
import { DetailedHTMLProps, HTMLAttributes, MutableRefObject, ReactNode } from "react";

export interface ChatProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    chats: IChat[];
}

export interface ChatItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    chat?: IChat;
    user: { userId: number; userRole: UserRole }
    children: ReactNode;
    innerRef: MutableRefObject<null>;
}