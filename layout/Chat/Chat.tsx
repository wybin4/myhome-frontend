import { ChatProps } from "./Chat.props";
import styles from "./Chat.module.css";
import { useState } from "react";
import ChatIcon from "./chat.svg";
import WriteIcon from "./write.svg";
import { Icon } from "@/components";
import CloseIcon from "../close.svg";
import { IChat, IMessage, MessageStatus } from "@/interfaces/chat.interface";
import { format } from "date-fns";
import { UserRole } from "@/interfaces/account/user.interface";

export const Chat = ({ chats, className, ...props }: ChatProps): JSX.Element => {
    const [isChat, setIsChat] = useState<boolean>(false);

    // ИСПРАВИТЬ!!!!
    const userId = 1;
    const userRole = UserRole.Owner;

    const getTime = (message: IMessage) => {
        return format(new Date(message.createdAt), "HH:mm");
    };

    const getCap = (text: string) => {
        const phrases = text.split(" ");
        if ((text.match(/"/g) || []).length === 2) {
            const matches = text.match(/"([^"]*)"/g);
            const extractedText = matches ? matches.map(match => match.slice(1, -1)) : [];
            if (!extractedText) {
                return `${phrases[0][0].toUpperCase()}${phrases[1][0].toUpperCase()}`;
            }
            const phr = extractedText[0].split(" ");
            return `${phr[0][0].toUpperCase()}${phr[1][0].toUpperCase()}`;
        }
        return `${phrases[0][0].toUpperCase()}${phrases[1][0].toUpperCase()}`;
    };

    const getName = (chat: IChat) => {
        if (chat && chat.users) {
            const exists = chat.users.find(user => {
                return user.userId !== userId ||
                    user.userRole !== userRole;
            });
            if (!exists) {
                return {
                    name: "",
                    cap: ""
                };
            }
            return {
                name: exists.name,
                cap: getCap(exists.name)
            };
        } else return {
            name: "",
            cap: ""
        };
    };

    return (
        <div className={className} {...props}>
            <div className={styles.icon}>
                {!isChat &&
                    <Icon
                        size="s" type="icon"
                        onClick={() => setIsChat(!isChat)}
                    >
                        <ChatIcon />
                    </Icon>
                }
                {isChat && <Icon size="s" type="icon"><WriteIcon /></Icon>}
            </div>
            {isChat &&
                <div className={styles.chatsWrapper}>
                    <span
                        onClick={() => setIsChat(!isChat)}
                        className={styles.closeIcon}
                    >
                        <CloseIcon />
                    </span>
                    <div className={styles.mobileText}>Чаты</div>
                    {chats && chats
                        .sort((a, b) => {
                            const lastMessageA = a.messages?.[a.messages.length - 1];
                            const lastMessageB = b.messages?.[b.messages.length - 1];

                            const dateA = lastMessageA?.createdAt || a.createdAt;
                            const dateB = lastMessageB?.createdAt || b.createdAt;

                            return new Date(dateB).getTime() - new Date(dateA).getTime();
                        })
                        .map((chat, key) => {
                            const lastMessage = chat.messages?.[chat.messages.length - 1];
                            const { name, cap } = getName(chat);

                            return (
                                <div className={styles.chat} key={key}>
                                    <div className={styles.photoIcon}>{cap}</div>
                                    <div>
                                        <div className={styles.name}>{name}</div>
                                        {lastMessage &&
                                            <div className={styles.lastMessage}>
                                                {
                                                    lastMessage.sender.userId === userId &&
                                                    lastMessage.sender.userRole === userRole &&
                                                    "Вы: "
                                                }
                                                {lastMessage.text}
                                            </div>
                                        }
                                    </div>
                                    {lastMessage &&
                                        <div className={styles.thirdCol}>
                                            <div className={styles.time}>{getTime(lastMessage)}</div>
                                            <div className={styles.countUnread}>{
                                                chat.messages?.reduce((count, message) => {
                                                    if (
                                                        message.status === MessageStatus.Unread &&
                                                        (message.sender.userId !== userId || message.sender.userRole !== userRole)
                                                    ) {
                                                        return count + 1;
                                                    }
                                                    return count;
                                                }, 0)
                                            }</div>
                                        </div>
                                    }
                                </div>
                            );

                        })}
                </div>
            }
        </div>
    );
};