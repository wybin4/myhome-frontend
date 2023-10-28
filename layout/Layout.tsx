import { FunctionComponent, useEffect, useState } from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";
import { Navigation } from "./Navigation/Navigation";
import { AppContextProvider, IAppContext } from "@/context/app.context";
import cn from 'classnames';
import { Notification } from "./Notification/Notification";
import { Chat } from "./Chat/Chat";
import { IChat } from "@/interfaces/chat.interface";
import { IServiceNotification } from "@/interfaces/event/notification.interface";
import { io } from "socket.io-client";

const Layout = ({ children }: LayoutProps): JSX.Element => {
    const [chats, setChats] = useState<IChat[]>([]);
    const [notifications, setNotifications] = useState<IServiceNotification[]>([]);

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

        socket.on('chats', function (data) {
            setChats(data.chats);
        });

        socket.on('newChat', function (data) {
            setChats((chats: IChat[] | null) => {
                if (chats) {
                    const newChats = [...chats, data];
                    return newChats;
                } else {
                    return [data];
                }
            });
        });

        socket.on('newMessage', function (data) {
            setChats((chats) => {
                if (chats) {
                    const updatedChats = chats.map((chat) => {
                        if (chat._id === data.chatId) {
                            const updatedChat = { ...chat };
                            if (updatedChat.messages) {
                                updatedChat.messages = [...updatedChat.messages, data];
                            } else {
                                updatedChat.messages = [data];
                            }
                            return updatedChat;
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
        <div className={cn(styles.wrapper, {
            // [styles.blurScreen]: isFormOpened ИСПРАВИТЬ
        })}>
            <Header className={styles.header} />
            <Navigation className={styles.navigation} />
            <Notification notifications={notifications} className={styles.notification} />
            <Chat chats={chats} />
            <div className={styles.body}>
                {children}
            </div>
            <Footer className={styles.footer} />
        </div>
    );
};

export const withLayout = <T extends Record<string, unknown> & IAppContext>(Component: FunctionComponent<T>) => {
    return function withLayoutComponent(props: T): JSX.Element {
        return (
            <AppContextProvider
                role={props.role}
            >
                <Layout>
                    <Component {...props} />
                </Layout>
            </AppContextProvider>
        );
    };
};