import { UserRole } from "@/interfaces/account/user.interface";
import { IChat, IChatUser } from "@/interfaces/chat.interface";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, MutableRefObject, ReactNode, SetStateAction } from "react";

export interface ChatProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    chats: IChat[];
    isChatItemRef: MutableRefObject<string>;
    user: { userId: number; userRole: UserRole };
}

export interface ChatItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    chat?: IChat;
    user: { userId: number; userRole: UserRole };
    children: ReactNode;
    innerRef: MutableRefObject<null>;
}

export interface ReceiversItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    receivers: IChatUser[];
    user: { userId: number; userRole: UserRole };
    isChatItemRef: MutableRefObject<string>;
    setIsReceiverItem: Dispatch<SetStateAction<boolean>>;
}