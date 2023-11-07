import { Form, Table } from "@/components";
import { API } from "@/helpers/api";
import { UserRole, UserRoleType } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IHouse } from "@/interfaces/reference/subscriber/house.interface";
import { HouseNotificationType, IHouseNotification } from "@/interfaces/event/notification.interface";
import { EventType, IGetEvents, IGetHouseNotification } from "@/interfaces/event.interface";

function HouseNotification({ data }: IHouseNotificationProps): JSX.Element {
    const useFormData = useForm<IHouseNotification>();
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);

    type HouseNotificationData = {
        id: number[];
        title: string[];
        text: string[];
        type: string[];
        createdAt: string[];
        name: string[];
    };

    const initialData: HouseNotificationData = {
        id: [],
        title: [],
        text: [],
        type: [],
        createdAt: [],
        name: []
    };

    const notifications: HouseNotificationData = data.notifications.reduce(
        (accumulator, notification) => {
            accumulator.id.push(notification.id);
            accumulator.title.push(notification.title);
            accumulator.text.push(notification.text);
            const typeArr = Object.entries(HouseNotificationType).find(([key]) => key === notification.type);
            let type: string;
            if (typeArr) {
                type = typeArr[1];
            } else {
                type = "";
            }
            accumulator.type.push(type);
            accumulator.name.push(notification.name);
            accumulator.createdAt.push(format(new Date(notification.createdAt), "dd.MM.yyyy"));
            return accumulator;
        },
        initialData
    );

    const houses = data.houses.map(house => {
        return {
            value: house.id,
            text: `${house.city}, ${house.street} ${house.houseNumber}`
        };
    });

    const types = Object.entries(HouseNotificationType).map(([key, value]) => ({
        text: value,
        value: key,
    }));

    const {
        id, title, type, text, name, createdAt
    } = notifications;

    return (
        <>
            <Form<IHouseNotification>
                successMessage={"Уведомление отправлено"}
                successCode={201}
                additionalFormData={
                    [{ managementCompanyId: 1, createdAt: new Date() }]
                }
                urlToPost={API.managementCompany.houseNotification.add}
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title={"Отправка уведомления"}
                oneRow={true}
                inputs={[
                    {
                        title: "Тема уведомления",
                        inputType: "string",
                        id: "title",
                        type: "input",
                        numberInOrder: 3,
                        error: {
                            value: true, message: "Введите тему уведомления"
                        }
                    },
                ]}
                selectors={[{
                    inputTitle: "Дом",
                    options: houses,
                    id: "houseId",
                    type: "select",
                    numberInOrder: 1,
                    error: {
                        value: true, message: "Выберите дом"
                    }
                },
                {
                    inputTitle: "Тип уведомления",
                    options: types,
                    id: "type",
                    type: "select",
                    numberInOrder: 2,
                    error: {
                        value: true, message: "Выберите тип уведомления"
                    }
                }]}
                textAreas={[{
                    title: "Подробности",
                    id: "text",
                    type: "textarea",
                    numberInOrder: 4,
                    error: {
                        value: true, message: "Введите текст уведомления"
                    }
                }]}
            />
            <Table
                title="Уведомления"
                filters={[
                    {
                        title: "Дата",
                        titleEng: "createdAt",
                        type: "date"
                    },
                    {
                        title: "Тип уведомления",
                        titleEng: "type",
                        type: "checkbox",
                        items: type
                    }
                ]}
                buttons={[{
                    type: "add",
                    title: "Добавить",
                    appearance: "primary",
                    onClick: () => setIsFormOpened(true)
                }]}
                rows={{
                    actions: {
                        actions: [{ type: "view", onClick: () => { }, id: 0 }]
                    },
                    ids: id,
                    items: [
                        {
                            title: "Тема",
                            type: "text",
                            items: title
                        },
                        {
                            title: "Тип",
                            type: "text",
                            items: type
                        },
                        {
                            title: "Дом",
                            type: "text",
                            items: name
                        },
                        {
                            title: "Дата создания",
                            type: "text",
                            items: createdAt
                        },
                        {
                            title: "Подробности",
                            type: "text",
                            items: text
                        },
                    ],
                    keyElements: {
                        first: [2], second: 1, tags: [3, 4],
                        isSecondNoNeedTitle: true
                    }
                }} />
        </>
    );
}

export default withLayout(HouseNotification);

export async function getServerSideProps() {
    // ИСПРАВИТЬ!!!!
    const postDataHouses = {
        userId: 1,
        userRole: UserRole.ManagementCompany
    };
    const postDataVotings = {
        userId: 1,
        userRole: UserRole.ManagementCompany,
        events: [EventType.Notification]
    };

    try {
        const notifications = await axios.post<{ events: IGetEvents }>(API.event.get, postDataVotings);
        const houses = await axios.post<{ houses: IHouse[] }>(API.managementCompany.reference.house.get, postDataHouses);
        if (!notifications.data || !houses.data) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    notifications: notifications.data.events.notifications,
                    houses: houses.data.houses
                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface IHouseNotificationProps extends Record<string, unknown> {
    data: { notifications: IGetHouseNotification[]; houses: IHouse[] };
    role: UserRoleType;
}