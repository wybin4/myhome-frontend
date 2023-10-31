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
    const chatsRef = useRef(null);
    const chatItemRef = useRef(null);

    // ИСПРАВИТЬ!!!!
    const user = {
        userId: 1,
        userRole: UserRole.Owner
    };

    const getTime = (message: IMessage) => {
        return format(new Date(message.createdAt), "HH:mm");
    };

    const closeChats = (e: MouseEvent) => {
        if (chatsRef && window.innerWidth >= 900) {
            let targetClass;
            const target = e.target as HTMLElement | null;
            if (target) {
                if (!target.classList.contains("viewChats")) {
                    const parent = target.parentElement;
                    if (parent && parent.classList.contains("viewChats")) {
                        targetClass = parent.className;
                    } else if (parent && parent.parentElement && parent.parentElement.classList.contains("viewChats")) {
                        targetClass = parent.parentElement.className;
                    }
                } else {
                    targetClass = target.className;
                }
            }
            if (
                chatsRef.current
                && !(chatsRef.current as Node).contains(e.target as Node)
                && !(targetClass && targetClass?.split(" ")?.includes("viewChats"))
            ) {
                setIsChat(false);
            }
        }
    };

    const closeChatItem = (e: MouseEvent) => {
        if (chatItemRef) {
            let targetClass;
            const target = e.target as HTMLElement | null;
            if (target) {
                if (!target.classList.contains("viewChatItem")) {
                    const parent = target.parentElement;
                    if (parent && parent.classList.contains("viewChatItem")) {
                        targetClass = parent.className;
                    } else if (parent && parent.parentElement && parent.parentElement.classList.contains("viewChatItem")) {
                        targetClass = parent.parentElement.className;
                    }
                } else {
                    targetClass = target.className;
                }
            }
            if (
                chatItemRef.current
                && !(chatItemRef.current as Node).contains(e.target as Node)
                && !(targetClass && targetClass?.split(" ")?.includes("viewChatItem"))
            ) {
                setIsChatItem("");
            }
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeChats);
        document.addEventListener("click", closeChatItem);
        return () => {
            document.removeEventListener("click", closeChats);
            document.removeEventListener("click", closeChatItem);
        };
    }, []);

    useEffect(() => {
        if (isChat || isChatItem) {
            document.body.style.overflowY = "hidden";
        } else document.body.style.overflowY = "";
    }, [isChat, isChatItem]);

    return (
        <div className={className} {...props}>
            <div className={cn(styles.icon, "viewChats")}>
                {!isChat &&
                    <Icon
                        size="s" type="icon"
                        className={cn("viewChats", styles.chatIcon)}
                        onClick={() => setIsChat(!isChat)}
                    >
                        <ChatIcon />
                    </Icon>
                }
                {isChat && <Icon size="s" type="icon" className={styles.writeIcon}><WriteIcon /></Icon>}
            </div>
            {isChat &&
                <div className={styles.chatsWrapper} ref={chatsRef}>
                    <span
                        onClick={() => {
                            setIsChat(!isChat);
                        }}
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
                            const countUnread = chat.messages?.reduce((count, message) => {
                                if (
                                    message.status === MessageStatus.Unread &&
                                    (message.sender.userId !== user.userId || message.sender.userRole !== user.userRole)
                                ) {
                                    return count + 1;
                                }
                                return count;
                            }, 0);
                            return (
                                <div
                                    className={cn(styles.chat, "viewChatItem")} key={key}
                                    onClick={async () => {
                                        setIsChatItem(chat._id ? chat._id : "");
                                        setIsChat(!isChat);
                                        if (chat._id) {
                                            await axios.post(API.chat.read, {
                                                userId: user.userId,
                                                userRole: user.userRole,
                                                chatId: chat._id
                                            });
                                        }
                                    }}
                                >
                                    <div className={cn(styles.photoIcon, "viewChatItem")}>{cap}</div>
                                    <div>
                                        <div className={cn(styles.name, "viewChatItem")}>{name}</div>
                                        {lastMessage &&
                                            <div className={cn(styles.lastMessage, "viewChatItem")}>
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
                                        <div className={cn(styles.thirdCol, "viewChatItem")}>
                                            <div className={cn(styles.time, "viewChatItem")}>{getTime(lastMessage)}</div>
                                            {countUnread !== 0 && <div className={cn(styles.countUnread, "viewChatItem")}>{
                                                countUnread
                                            }</div>}
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
                    innerRef={chatItemRef}
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

const ChatItem = ({ chat, user, children, innerRef, className, ...props }: ChatItemProps): JSX.Element => {
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
        if (chat && message !== "") {
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
                <div className={className} {...props} ref={innerRef}>
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