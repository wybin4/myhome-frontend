/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";
import { IHouse } from "@/interfaces/reference/subscriber/house.interface";
import { HouseNotificationType, IHouseNotificationReferenceData, IHouseNotificationReferenceDataItem, notificationPageComponent } from "@/interfaces/event/notification.interface";
import { EventType, IGetEvents } from "@/interfaces/event.interface";
import { enrichReferenceComponent, fetchReferenceData } from "@/helpers/reference-constants";
import { GetServerSidePropsContext } from "next";
import { IAppContext } from "@/context/app.context";
import { ReferencePageComponent } from "@/page-components";
import { getEnumKeyByValue } from "@/helpers/constants";


function HouseNotification({ data: initialData }: IHouseNotificationProps): JSX.Element {
    const [data, setData] = useState(initialData);

    const getItem = () => {
        const notifications = data.notifications.sort((b, a) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const newItem = enrichReferenceComponent({ notifications }, notificationPageComponent, "notification");
        return (
            <ReferencePageComponent<IHouseNotificationReferenceDataItem>
                item={newItem}
                uriToAdd={API.managementCompany.houseNotification.add}
                additionalSelectorOptions={[...data.additionalData, {
                    data: Object.values(HouseNotificationType).map(h => { return { type: String(h), id: getEnumKeyByValue(HouseNotificationType, h) }; }),
                    id: 'type'
                }]}
                setPostData={setPostData}
                addMany={false}
            />
        );
    };

    const setPostData = (newData: any) => {
        setData(prevData => {
            const { notifications, ...rest } = prevData;
            if (notifications.length) {
                const notifications = [...prevData.notifications, newData.notification];
                return { notifications, ...rest } as IHouseNotificationReferenceData & {
                    additionalData: {
                        data: Record<string, string | number>[];
                        id: string;
                    }[]
                };
            } else {
                const notifications = [newData.notification];
                return { notifications, ...rest } as IHouseNotificationReferenceData & {
                    additionalData: {
                        data: Record<string, string | number>[];
                        id: string;
                    }[]
                };
            }
        });
    };

    return (
        <>
            {getItem()}
        </>
    );
}

export default withLayout(HouseNotification);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const postDataHouseNotifications = {
        events: [EventType.Notification]
    };

    try {
        const { props: notificationProps } = await fetchReferenceData<{ events: IGetEvents }>(context, API.event.get, postDataHouseNotifications);
        const { props: houseProps } = await fetchReferenceData<{ houses: IHouse[] }>(context, API.reference.house.get, { "isAllInfo": true });
        if (!notificationProps || !houseProps) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    notifications: ('events' in notificationProps.data) ? notificationProps.data.events.notifications : [],
                    additionalData: [
                        {
                            data: ('houses' in houseProps.data) ? houseProps.data.houses : [],
                            id: 'houseId'
                        }
                    ]
                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface IHouseNotificationProps extends Record<string, unknown>, IAppContext {
    data: IHouseNotificationReferenceData & { additionalData: { data: Record<string, string | number>[]; id: string }[] };
}