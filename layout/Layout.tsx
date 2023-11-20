import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";
import { Navigation } from "./Navigation/Navigation";
import { AppContext, AppContextProvider, IAppContext } from "@/context/app.context";
import cn from 'classnames';
import { Notification } from "./Notification/Notification";
import { Chat } from "./Chat/Chat";
import { IChat, IMessage } from "@/interfaces/chat.interface";
import { IServiceNotification } from "@/interfaces/event/notification.interface";
import { io } from "socket.io-client";
import { API, api } from "@/helpers/api";
import { NavMenu } from "./NavMenu/NavMenu";
import { UserRole } from "@/interfaces/account/user.interface";

const Layout = ({ children }: LayoutProps): JSX.Element => {
    const [chats, setChats] = useState<IChat[]>([]);
    const [notifications, setNotifications] = useState<IServiceNotification[]>([]);
    const { userId, userRole } = useContext(AppContext);
    // const [isChatItem, setIsChatItem] = useState<string>("");
    const isChatItemRef = useRef("");

    const user = {
        userId: userId,
        userRole: userRole
    };

    useEffect(() => {
        const socket = io('http://localhost:3100', {
            extraHeaders: {
                // ИСПРАВИТЬ!!!
                Authorization: 'Bearer YOUR_TOKEN_HERE',
            },
        });

        socket.on('connect', function () {
            console.log('Connected');
        });

        socket.on('notifications', function (data) {
            setNotifications(data.notifications);
        });

        socket.on('newNotification', function (data) {
            setNotifications((notifications: IServiceNotification[] | null) => {
                if (notifications) {
                    const newNotifications = [...notifications, data];
                    return newNotifications;
                } else {
                    return [data];
                }
            });
        });

        socket.on('readNotifications', function (data) {
            if (data) {
                setNotifications((notifications) => {
                    if (notifications) {
                        return notifications.map((notification) => {
                            const exists = data.find((n: IServiceNotification) => n.id === notification.id);
                            if (exists) {
                                return exists;
                            } else return notification;
                        });
                    } else {
                        return [];
                    }
                });
            }
        });

        socket.on('chats', function (data) {
            setChats(data.chats);
        });

        socket.on('newChat', async function (data) {
            setChats((chats: IChat[] | null) => {
                if (chats) {
                    const newChats = [...chats, data];
                    return newChats;
                } else {
                    return [data];
                }
            });
        });

        socket.on('newMessage', async function (data) {
            setChats((chats) => {
                if (chats) {
                    const updatedChats = chats.map((chat) => {
                        if (chat._id === data.createdMessage.chatId) {
                            if (chat.messages) {
                                const updatedChat = chat.messages.map((message) => {
                                    const updatedMessage = data.updatedMessages.find((m: IMessage) => m._id === message._id);
                                    if (updatedMessage) {
                                        return updatedMessage;
                                    }
                                    return message;
                                });
                                chat.messages = [...updatedChat, data.createdMessage];
                            } else {
                                chat.messages = [data.createdMessage];
                            }
                        }
                        return chat;
                    });
                    return updatedChats;
                } else {
                    return [];
                }
            });

            if (data.createdMessage && isChatItemRef.current === data.createdMessage.chatId) {
                await api.post(API.chat.readMessages, {
                    userId: user.userId,
                    userRole: user.userRole,
                    chatId: data.createdMessage.chatId
                });
            }
        });

        socket.on('readMessages', function (data) {
            setChats((chats) => {
                if (chats) {
                    const updatedChats = chats.map((chat) => {
                        if (chat._id === data.chatId) {
                            if (chat.messages) {
                                chat.messages = chat.messages.map((message) => {
                                    const updatedMessage = data.messages.find((m: IMessage) => m._id === message._id);
                                    if (updatedMessage) {
                                        return updatedMessage;
                                    }
                                    return message;
                                });
                            }
                        }
                        return chat;
                    });
                    return updatedChats;
                } else {
                    return [];
                }
            });
        });

        socket.on('disconnect', function () {
            console.log('Disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {user && user.userRole && user.userRole !== UserRole.None &&
                <div className={cn(styles.wrapper, {
                    // [styles.blurScreen]: isFormOpened ИСПРАВИТЬ
                })}>
                    <Header className={styles.header} />
                    <Navigation user={user} className={styles.navigation} />
                    <NavMenu user={user} className={styles.navMenu} />
                    <Notification user={user} notifications={notifications} className={styles.notification} />
                    <Chat
                        isChatItemRef={isChatItemRef}
                        user={user} chats={chats}
                    />
                    <div className={styles.body}>
                        {children}
                    </div>
                    <Footer className={styles.footer} />
                </div>
            }
        </>
    );
};

export const withLayout = <T extends Record<string, unknown> & IAppContext>(Component: FunctionComponent<T>) => {
    return function withLayoutComponent(props: T): JSX.Element {
        return (
            <AppContextProvider
                userId={props.userId}
                userRole={props.userRole}
            >
                <Layout>
                    <Component {...props} />
                </Layout>
            </AppContextProvider>
        );
    };
};