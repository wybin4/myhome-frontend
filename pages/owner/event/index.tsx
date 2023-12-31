import { Card, Htag, TableButton, TableFilter } from "@/components";
import { withLayout } from "@/layout/Layout";
import { useState, useRef, useContext } from "react";
import NotificationIcon from "./notification.svg";
import VotingIcon from "./voting.svg";
import cn from "classnames";
import { EventType, IGetEvents, IGetHouseNotification, IGetVoting } from "@/interfaces/event.interface";
import { API, api } from "@/helpers/api";
import { getEnumKeyByValue, getHumanDate } from "@/helpers/constants";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { IOption, VotingStatus } from "@/interfaces/event/voting.interface";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { GetServerSidePropsContext } from "next";
import { AppContext, IAppContext } from "@/context/app.context";

interface IEvent {
    event: IGetVoting | IGetHouseNotification;
    type: EventType;
}

function Event({ data }: EventProps): JSX.Element {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterButtonRef = useRef(null);
    const { userId } = useContext(AppContext);
    const closeStatus = getEnumKeyByValue(VotingStatus, VotingStatus.Close);

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
                            <div className="flex flex-col gap-8 my-6">
                                {events.events.map((e, key2) => {
                                    let date1: string, options: IOption[] | undefined, active: IOption | undefined;
                                    const date2 = format(new Date(e.event.createdAt), "hh:mm d MMMM yyyy", { locale: ru });

                                    switch (e.type) {
                                        case EventType.Voting:
                                            date1 = format(new Date((e.event as IGetVoting).expiredAt), "dd.MM.yyyy");
                                            options = (e.event as IGetVoting).options ? (e.event as IGetVoting).options : [];
                                            active = (e.event as IGetVoting).options?.find(o => o.votes.find(v => v.userId === userId));
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
                                                        activeId: active ? active.id : 0,
                                                        options: options ? options : [],
                                                        onAnswer: async (answerId: number) => {
                                                            await api.post(API.subscriber.voting.update, {
                                                                "optionId": answerId,
                                                                "userId": userId
                                                            });
                                                        },
                                                        isClose: (e.event as IGetVoting).status === closeStatus
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
                        items: [{
                            value: "Voting",
                            text: "Опрос"
                        }, {
                            value: "Notification",
                            text: "Уведомление"
                        }]
                    }, {
                        title: "Дата",
                        titleEng: "createdAt",
                        type: "date"
                    }
                    ]}
                    isOpen={isFilterOpened}
                    setIsOpen={setIsFilterOpened}
                    filterButtonRef={filterButtonRef} isOne={true}
                />
            </div>
        </>
    );
}

export default withLayout(Event);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const postData = {
        events: [EventType.Voting, EventType.Notification]
    };

    const { props } = await fetchReferenceData<{ events: IGetEvents }>(context, API.event.get, postData);
    if (!props) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            data: {
                notifications: ('events' in props.data) ? props.data.events.notifications.notifications : [],
                votings: ('events' in props.data) ? props.data.events.votings.votings : []
            }
        }
    };
}

interface EventProps extends Record<string, unknown>, IAppContext {
    data: {
        notifications: IGetHouseNotification[];
        votings: IGetVoting[];
    };
}