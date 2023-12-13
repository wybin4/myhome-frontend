/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import { EventType, IGetAppeal, IGetEvents } from "@/interfaces/event.interface";
import { AppealPageComponent } from "@/page-components";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData, handleFilter } from "@/helpers/reference-constants";
import { AppContext, IAppContext } from "@/context/app.context";
import { useContext, useState } from "react";
import { setPostDataForEvent, getPagination } from "../reference-helper";
import { PAGE_LIMIT } from "@/helpers/constants";

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
                user={{ userId, userRole }}
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
    const { props } = await fetchReferenceData<{ events: IGetEvents }>(context, uriToGet, postDataAppeals, true);
    if (!props) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            data: {
                appeals: ('events' in props.data) ? props.data.events.appeals.appeals : [],
                totalCount: ('events' in props.data) ? props.data.events.appeals.totalCount : null,
            }
        }
    };
}

interface AppealProps extends Record<string, unknown>, IAppContext {
    data: { appeals: IGetAppeal[]; totalCount: number; };
}