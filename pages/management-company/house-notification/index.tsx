import { Form, Table } from "@/components";
import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IHouse } from "@/interfaces/reference/subscriber/house.interface";
import { HouseNotificationType, IHouseNotification } from "@/interfaces/notification.interface";

function HouseNotification({ data }: IHouseNotificationProps): JSX.Element {
    const useFormData = useForm<IHouseNotification>();
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);

    type HouseNotificationData = {
        id: number[];
        title: string[];
        text: string[];
        type: string[];
        createdAt: string[];
        houseName: string[];
    };

    const initialData: HouseNotificationData = {
        id: [],
        title: [],
        text: [],
        type: [],
        createdAt: [],
        houseName: []
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
            accumulator.houseName.push(notification.houseName);
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
        id, title, type, text, houseName, createdAt
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
                inputs={[
                    {
                        title: "Тема уведомления",
                        size: "m",
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
                    size: "m",
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
                    size: "m",
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
                            items: houseName
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
                    keyElements: { first: [2], second: 1, isSecondNoNeedTitle: true }
                }} />
        </>
    );
}

export default withLayout(HouseNotification);

export async function getServerSideProps() {
    const postData = {
        managementCompanyId: 1 // ИСПРАВИТЬ!!!!
    };

    try {
        const notifications = await axios.post<{ notifications: IHouseNotificationData[] }>(API.managementCompany.houseNotification.get, postData);
        const houses = await axios.post<{ houses: IHouse[] }>(API.managementCompany.reference.house.get, postData);
        if (!notifications.data || !houses.data) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    notifications: notifications.data.notifications,
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
    data: { notifications: IHouseNotificationData[]; houses: IHouse[] };
    role: UserRole;
}

interface IHouseNotificationData extends IHouseNotification {
    id: number;
    houseName: string;
}