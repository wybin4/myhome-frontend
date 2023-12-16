/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppContext, IAppContext } from "@/context/app.context";
import { API, api } from "@/helpers/api";
import { PAGE_LIMIT } from "@/helpers/constants";
import { fetchReferenceData, handleFilter } from "@/helpers/reference-constants";
import { IGetUserWithSubscriber } from "@/interfaces/account/user.interface";
import { EventType, IGetEvents, IGetAppeal } from "@/interfaces/event.interface";
import { IFilter } from "@/interfaces/meta.interface";
import { withLayout } from "@/layout/Layout";
import { AppealPageComponent, setPostDataForEvent } from "@/page-components";
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
    const [filters, setFilters] = useState<IFilter[]>();
    const endOffset = itemOffset + PAGE_LIMIT;

    const setPostData = (newData: any, isNew?: boolean, isGet?: boolean) => {
        setPostDataForEvent(setData, name, newData, isNew, isGet);
    };

    const handlePaginate = async (
        selected: number,
    ) => {
        if (data.totalCount !== data.appeals.length) {
            const { data: newData } = await api.post(API.event.get, {
                meta: {
                    limit: PAGE_LIMIT,
                    page: selected + 1,
                },
                ...postDataAppeals
            });
            setPostData(newData, false, true);
        }
    };

    const handleFilterClick = async (value: string[], id: string) => {
        await handleFilter(
            value, id,
            uriToGet, postDataAppeals, setPostData,
            setItemOffset, filters, setFilters
        );
    };

    return (
        <>
            <AppealPageComponent
                endOffset={endOffset} totalCount={data.totalCount} itemOffset={itemOffset} setItemOffset={setItemOffset}
                handlePaginate={handlePaginate}
                isData={initialData.totalCount !== null || data.totalCount !== null}
                handleFilter={handleFilterClick}
                user={{ userId, userRole }} users={data.users}
                appeals={data.appeals}
            />
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