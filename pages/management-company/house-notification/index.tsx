/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { API, api } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";
import { IHouse } from "@/interfaces/reference/subscriber/house.interface";
import { HouseNotificationType, IHouseNotificationReferenceData, IHouseNotificationReferenceDataItem, notificationPageComponent } from "@/interfaces/event/notification.interface";
import { EventType, IGetEvents } from "@/interfaces/event.interface";
import { GetServerSidePropsContext } from "next";
import { IAppContext } from "@/context/app.context";
import { ReferencePageComponent, getPagination, setPostDataForEvent } from "@/page-components";
import { PAGE_LIMIT, getEnumKeyByValue } from "@/helpers/constants";
import { enrichReferenceComponent, handleFilter, fetchReferenceData, handleSearch, handleFilterDateClick } from "@/helpers/reference-constants";
import { IFilter, ISearch } from "@/interfaces/meta.interface";
import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";

const postDataHouseNotifications = {
    events: [EventType.Notification]
};
const uriToGet = API.event.get;
const name = "notification";

function HouseNotification({ data: initialData }: IHouseNotificationProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [itemOffset, setItemOffset] = useState(0);
    const [filters, setFilters] = useState<IFilter[]>();
    const [search, setSearch] = useState<ISearch>();

    const getItem = () => {
        const endOffset = itemOffset + PAGE_LIMIT;
        const notifications = data.notifications.sort((b, a) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const newItem = enrichReferenceComponent({ notifications }, notificationPageComponent, name, itemOffset, endOffset);

        return (
            <>
                <ReferencePageComponent<IHouseNotificationReferenceDataItem>
                    item={newItem}
                    uriToAdd={API.managementCompany.houseNotification.add}
                    additionalSelectorOptions={[...data.additionalData, {
                        data: Object.values(HouseNotificationType).map(h => { return { name: String(h), id: getEnumKeyByValue(HouseNotificationType, h) }; }),
                        id: 'type'
                    }]}
                    setPostData={setPostData}
                    addMany={false}
                    isData={initialData.totalCount !== null || data.totalCount !== null}
                    handleFilter={async (value: string[], id: string) => {
                        await handleFilter(
                            value, id,
                            uriToGet, postDataHouseNotifications, setPostData,
                            setItemOffset, filters, setFilters, search
                        );
                    }}
                    handleFilterDate={async (value: IBaseDateRange | undefined, id: string) => {
                        await handleFilterDateClick(
                            value, id,
                            uriToGet, postDataHouseNotifications, setPostData,
                            setItemOffset, filters, setFilters, search
                        );
                    }}
                    handleSearch={async (value: string, id: string) => {
                        await handleSearch(
                            value, id,
                            uriToGet, postDataHouseNotifications, setPostData,
                            setItemOffset, setSearch, filters
                        );
                    }}
                />
                {getPagination(
                    setItemOffset, data, initialData, name + "s",
                    uriToGet, postDataHouseNotifications, setPostData,
                    search, filters
                )}
            </>
        );
    };

    const setPostData = (newData: any, isNew?: boolean, isGet?: boolean) => {
        setPostDataForEvent(setData, name, newData, isNew, isGet);
    };

    return (
        <>
            {getItem()}
        </>
    );
}

export default withLayout(HouseNotification);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const { props: notificationProps } = await fetchReferenceData<{ events: IGetEvents }>(context, uriToGet, postDataHouseNotifications, true);
        const { props: houseProps } = await fetchReferenceData<{ houses: IHouse[] }>(context, API.reference.house.get, { "isAllInfo": true });
        if (!notificationProps || !houseProps) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                data: {
                    notifications: ('events' in notificationProps.data) ? notificationProps.data.events.notifications.notifications : null,
                    additionalData: [
                        {
                            data: ('houses' in houseProps.data) ? houseProps.data.houses : [],
                            id: 'houseId'
                        }
                    ],
                    totalCount: ('events' in notificationProps.data && notificationProps.data.events.notifications.totalCount) ? notificationProps.data.events.notifications.totalCount : null,
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
    data: IHouseNotificationReferenceData & {
        additionalData: {
            data: Record<string, string | number>[];
            id: string
        }[];
        totalCount?: number;
    };
}