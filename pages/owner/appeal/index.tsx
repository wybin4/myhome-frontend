/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppContext, IAppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { PAGE_LIMIT } from "@/helpers/constants";
import { fetchReferenceData, handleFilter } from "@/helpers/reference-constants";
import { IGetUserWithSubscriber } from "@/interfaces/account/user.interface";
import { EventType, IGetEvents, IGetAppeal } from "@/interfaces/event.interface";
import { withLayout } from "@/layout/Layout";
import { AppealPageComponent } from "@/page-components";
import { getPagination, setPostDataForEvent } from "@/pages/management-company/reference-helper";
import { GetServerSidePropsContext } from "next";
import { useContext, useState } from "react";

const postDataAppeals = {
    events: [EventType.Appeal]
};
const uriToGet = API.event.get;
const name = "appeal";

function Appeal({ data: initialData }: AppealProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const { userId, userRole } = useContext(AppContext);
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + PAGE_LIMIT;

    const setPostData = (newData: any, isNew?: boolean, isGet?: boolean) => {
        setPostDataForEvent(setData, name, newData, isNew, isGet);
    };

    const handleFilterClick = async (value: string[], id: string) => {
        await handleFilter(
            value, id,
            uriToGet, postDataAppeals, setPostData,
            setItemOffset
        );
    };

    return (
        <>
            <AppealPageComponent
                isData={initialData.totalCount !== null || data.totalCount !== null}
                handleFilter={handleFilterClick}
                user={{ userId, userRole }} users={data.users}
                appeals={data.appeals.slice(itemOffset, endOffset)}
            />
            {getPagination(
                setItemOffset, data, initialData, name + "s",
                uriToGet, postDataAppeals, setPostData
            )}
        </>
    );
}

export default withLayout(Appeal);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const { props: eventProps } = await fetchReferenceData<{ events: IGetEvents }>(context, uriToGet, postDataAppeals, true);
        const { props: userProps } = await fetchReferenceData<{ users: IGetUserWithSubscriber[] }>(context, API.common.user.get, undefined);
        if (!eventProps || !userProps) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                data: {
                    appeals: ('events' in eventProps.data) ? eventProps.data.events.appeals.appeals : [],
                    users: ('users' in userProps.data) ? userProps.data.users : [],
                    totalCount: ('events' in eventProps.data) ? eventProps.data.events.appeals.totalCount : null,
                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface AppealProps extends Record<string, unknown>, IAppContext {
    data: {
        appeals: IGetAppeal[];
        users: IGetUserWithSubscriber[];
        totalCount: number;
    };
}