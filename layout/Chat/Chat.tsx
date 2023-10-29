import { ChatItemProps, ChatProps } from "./Chat.props";
import styles from "./Chat.module.css";
import { useEffect, useRef, useState } from "react";
import ChatIcon from "./chat.svg";
import WriteIcon from "./write.svg";
import BackIcon from "./back.svg";
import { Icon } from "@/components";
import SendIcon from "./send.svg";
import EmojiIcon from "./emoji.svg";
import CloseIcon from "../close.svg";
import TailIcon from "./tail.svg";
import { IChat, IMessage, MessageStatus } from "@/interfaces/chat.interface";
import { format, isToday, isYesterday } from "date-fns";
import { UserRole } from "@/interfaces/account/user.interface";
import { ru } from "date-fns/locale";
import cn from "classnames";
import axios from "axios";
import { API } from "@/helpers/api";

export const Chat = ({ chats, className, ...props }: ChatProps): JSX.Element => {
    const [isChat, setIsChat] = useState<boolean>(false);
    const [isChatItem, setIsChatItem] = useState<string>("");

    // ИСПРАВИТЬ!!!!
    const user = {
        userId: 1,
        userRole: UserRole.Owner
    };

    const getTime = (message: IMessage) => {
        return format(new Date(message.createdAt), "HH:mm");
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
                            const { name, cap } = getName(chat, user);

                            return (
                                <div
                                    className={styles.chat} key={key}
                                    onClick={() => {
                                        setIsChatItem(chat._id ? chat._id : "");
                                        setIsChat(!isChat);
                                    }}
                                >
                                    <div className={styles.photoIcon}>{cap}</div>
                                    <div>
                                        <div className={styles.name}>{name}</div>
                                        {lastMessage &&
                                            <div className={styles.lastMessage}>
                                                {
                                                    lastMessage.sender.userId === user.userId &&
                                                    lastMessage.sender.userRole === user.userRole &&
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
                                                        (message.sender.userId !== user.userId || message.sender.userRole !== user.userRole)
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
            {isChatItem !== "" &&
                <ChatItem
                    chat={chats.find(c => c._id === isChatItem)}
                    className={styles.chatItemWrapper}
                    user={user}
                >
                    <div
                        className={styles.backIcon}
                        onClick={() => {
                            setIsChatItem("");
                            setIsChat(!isChat);
                        }}
                    >
                        <BackIcon />
                    </div>
                </ChatItem>
            }
        </div>
    );
};

const ChatItem = ({ chat, user, children, className, ...props }: ChatItemProps): JSX.Element => {
    const [message, setMessage] = useState("");
    const lastMessageRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (lastMessageRef && lastMessageRef.current) {
            const ref = lastMessageRef.current as HTMLElement;
            ref.scrollIntoView();
        }
    }, [chat?.messages]);

    const groupMessagesByDate = (messages: IMessage[]) => {
        const groupedMessages: { [key: string]: IMessage[] } = {};

        for (const message of messages) {
            const dateKey = new Date(message.createdAt).toDateString();

            if (!groupedMessages[dateKey]) {
                groupedMessages[dateKey] = [];
            }

            groupedMessages[dateKey].push(message);
        }

        const result: { createdAt: Date; messages: IMessage[] }[] = Object.keys(groupedMessages).map(dateKey => ({
            createdAt: new Date(dateKey),
            messages: groupedMessages[dateKey],
        }));

        return result;
    };

    const handleTextareaInput = async () => {
        if (chat) {
            const postData = {
                chatId: chat._id,
                text: message,
                senderId: user.userId,
                senderRole: user.userRole
            };
            await axios.post(API.chat.send, postData);
            setMessage("");
            if (inputRef && inputRef.current) {
                const ref = inputRef.current as HTMLElement;
                ref.focus();
            }
        }
    };

    return (
        <>
            {chat &&
                <div className={className} {...props}>
                    <div className={styles.chatTopWrapper}>
                        {children}
                        <div className={styles.photoIcon}>{getName(chat, user).cap}</div>
                        <div>
                            <div className={styles.name}>{getName(chat, user).name}</div>
                            <div className={styles.description}>
                                Чат создан {format(
                                    new Date(chat.createdAt),
                                    "dd MMMM yyyy",
                                    { locale: ru }
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.messageWrapper}>
                        {chat.messages && groupMessagesByDate(chat.messages).map(
                            (messages, key) => {
                                const lastMessage = chat && chat.messages && chat.messages[chat.messages.length - 1];

                                return (
                                    <div className="flex flex-col" key={key}>
                                        <div className={styles.dateMark}>
                                            {getDate(messages.createdAt)}
                                        </div>
                                        {messages.messages.map(message => {
                                            const my = message.sender.userId === user.userId &&
                                                message.sender.userRole === user.userRole;
                                            const another = message.sender.userId !== user.userId ||
                                                message.sender.userRole !== user.userRole;
                                            const last = lastMessage?._id === message._id;
                                            return (
                                                <div
                                                    className="flex flex-col"
                                                    key={message._id}
                                                    ref={last ? lastMessageRef : null}
                                                >
                                                    <div className={cn({
                                                        [styles.myMessageItem]: my,
                                                        [styles.anotherMessageItem]: another,
                                                    })}>
                                                        {message.text}
                                                        <div className={styles.messageTail}><TailIcon /></div>
                                                    </div>
                                                    <div
                                                        className={cn({
                                                            [styles.myDate]: my,
                                                            [styles.anotherDate]: another,
                                                        })}
                                                    >
                                                        {format(new Date(message.createdAt), "HH:mm")}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }
                        )}
                    </div>
                    <div className={styles.messageInputWrapper}>
                        <EmojiIcon />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={styles.messageInput}
                            placeholder="Сообщение"
                            autoFocus
                            ref={inputRef}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.shiftKey === false) {
                                    e.preventDefault();
                                    handleTextareaInput();
                                }
                            }}
                        />
                        <div onClick={handleTextareaInput}>
                            <SendIcon />
                        </div>
                    </div>
                </div >
            }
        </>
    );
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

const getName = (chat: IChat, user: {
    userId: number;
    userRole: UserRole;
}) => {
    if (chat && chat.users) {
        const exists = chat.users.find(u => {
            return u.userId !== user.userId ||
                u.userRole !== user.userRole;
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

const getDate = (date: Date): string => {
    if (isToday(date)) {
        return 'Сегодня';
    } else if (isYesterday(date)) {
        return 'Вчера';
    } else if (date.getFullYear() === new Date().getFullYear()) {
        return format(date, "dd MMMM", { locale: ru });
    } else {
        return format(date, "dd MMMM yyyy", { locale: ru });
    }
};