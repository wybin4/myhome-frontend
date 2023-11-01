import { Card, Htag, TableButton, TableFilter } from "@/components";
import { withLayout } from "@/layout/Layout";
import { useState, useRef } from "react";
import NotificationIcon from "./notification.svg";
import VotingIcon from "./voting.svg";
import cn from "classnames";
import { EventType, IGetEvents, IGetHouseNotification, IGetVoting } from "@/interfaces/event.interface";
import { API } from "@/helpers/api";
import { UserRole, UserRoleType } from "@/interfaces/account/user.interface";
import axios from "axios";
import { getHumanDate } from "@/helpers/constants";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { IOption } from "@/interfaces/event/voting.interface";

interface IEvent {
    event: IGetVoting | IGetHouseNotification;
    type: EventType;
}

function Event({ data }: EventProps): JSX.Element {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterButtonRef = useRef(null);

    const groupEventsByDate = () => {
        if (data.notifications || data.votings) {
            const combinedData: IEvent[] = [
                ...data.notifications.map(n => {
                    return {
                        event: n,
                        type: EventType.Notification
                    };
                }),
                ...data.votings.map(v => {
                    return {
                        event: v,
                        type: EventType.Voting
                    };
                })
            ];

            const groupedData: { [key: string]: IEvent[] } = {};
            for (const data of combinedData) {
                const dateKey = new Date(data.event.createdAt).toDateString();
                if (!groupedData[dateKey]) {
                    groupedData[dateKey] = [];
                }
                groupedData[dateKey].push(data);
            }

            const result: { createdAt: Date; events: IEvent[] }[] = Object.keys(groupedData).map(dateKey => ({
                createdAt: new Date(dateKey),
                events: groupedData[dateKey],
            }));
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return result;
        }
        return [];
    };

    return (
        <>
            <div className={cn(
                "flex justify-between",
                "lg:flex-col lg:items-start",
                "md:flex-col md:items-center",
                "sm:flex-col sm:items-center"
            )}>
                <Htag size="h1" className="lg:mb-8 md:mb-4 sm:mb-4">События</Htag>
                <TableButton
                    buttons={[]}
                    isFiltersExist={true}
                    filterButtonRef={filterButtonRef}
                    isFilterOpened={isFilterOpened}
                    setIsFilterOpened={setIsFilterOpened}
                    filterAppearance="primary"
                />
            </div>
            <div className="flex flex-row-reverse justify-end gap-[4vw]">
                <div>
                    {groupEventsByDate().map((events, key1) => (
                        <div className="mt-4" key={key1}>
                            <Htag size="h3" className="mb-4">{getHumanDate(events.createdAt)}</Htag>
                            <div className="my-6">
                                {events.events.map((e, key2) => {
                                    let date1: string, options: IOption[] | undefined;
                                    const date2 = format(new Date(e.event.createdAt), "hh:mm d MMMM yyyy", { locale: ru });

                                    switch (e.type) {
                                        case EventType.Voting:
                                            date1 = format(new Date((e.event as IGetVoting).expiredAt), "dd.MM.yyyy");
                                            options = (e.event as IGetVoting).options ? (e.event as IGetVoting).options : [];
                                            return (
                                                <Card
                                                    key={key2}
                                                    maxWidth="44.625rem"
                                                    titlePart={{
                                                        text: e.event.title,
                                                        iconLeft: <VotingIcon />,
                                                        iconLeftSize: "s",
                                                        iconLeftVisible: false,
                                                        description: `${e.event.name} · Анонимный опрос до ${date1}`
                                                    }}
                                                    voting={{
                                                        options: options ? options.map(o => {
                                                            return {
                                                                text: o.text,
                                                                id: o.id
                                                            };
                                                        }) : [],
                                                        answers: options ? options.map(o => o.numberOfVotes) : [],
                                                        onAnswer: async (answerId: number) => {
                                                            await axios.post(API.subscriber.voting.update, {
                                                                "optionId": answerId
                                                            });
                                                        }
                                                    }}
                                                    bottom={{ text: date2 }}
                                                />
                                            );
                                        case EventType.Notification:
                                            return (
                                                <Card
                                                    key={key2}
                                                    maxWidth="44.625rem"
                                                    titlePart={{
                                                        text: e.event.title,
                                                        iconLeft: <NotificationIcon />,
                                                        iconLeftSize: "s",
                                                        description: e.event.name
                                                    }}
                                                    text={(e.event as IGetHouseNotification).text}
                                                    bottom={{ text: date2 }}
                                                />
                                            );
                                    }
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <TableFilter
                    title="Фильтры"
                    items={[{
                        title: "Тип",
                        titleEng: "type",
                        type: "checkbox",
                        items: ["Опрос", "Уведомление"]
                    }, {
                        title: "Дата",
                        titleEng: "createdAt",
                        type: "date"
                    }
                    ]}

                    isOpen={isFilterOpened}
                    setIsOpen={setIsFilterOpened}

                    filterButtonRef={filterButtonRef}
                />
            </div>
        </>
    );
}

export default withLayout(Event);

export async function getServerSideProps() {
    // ИСПРАВИТЬ!!!!
    const postData = {
        userId: 1,
        userRole: UserRole.Owner,
        events: [EventType.Voting, EventType.Notification]
    };

    try {
        const { data } = await axios.post<{ events: IGetEvents }>(API.event.get, postData);
        if (!data) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    notifications: data.events.notifications,
                    votings: data.events.votings
                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface EventProps extends Record<string, unknown> {
    data: {
        notifications: IGetHouseNotification[];
        votings: IGetVoting[];
    };
    role: UserRoleType;
}