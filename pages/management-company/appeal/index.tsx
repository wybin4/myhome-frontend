/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { withLayout } from "@/layout/Layout";
import { EventType, IGetAppeal, IGetEvents } from "@/interfaces/event.interface";
import { AppealPageComponent } from "@/page-components";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData, handleFilter, handleFilterDateClick } from "@/helpers/reference-constants";
import { AppContext, IAppContext } from "@/context/app.context";
import { useContext, useState } from "react";
import { setPostDataForEvent, getPagination } from "../reference-helper";
import { PAGE_LIMIT } from "@/helpers/constants";
import { IFilter } from "@/interfaces/meta.interface";
import { IBaseDateRange } from "@/components/primitive/DatePicker/DatePicker.props";

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
    const [filters, setFilters] = useState<IFilter[]>();

    const setPostData = (newData: any, isNew?: boolean, isGet?: boolean) => {
        setPostDataForEvent(setData, name, newData, isNew, isGet);
    };

    const handleFilterClick = async (value: string[], id: string) => {
        await handleFilter(
            value, id,
            uriToGet, postDataAppeals, setPostData,
            setItemOffset, filters, setFilters
        );
    };

    const handleDateFilterClick = async (value: IBaseDateRange | undefined, id: string) => {
        await handleFilterDateClick(
            value, id,
            uriToGet, postDataAppeals, setPostData,
            setItemOffset, filters, setFilters
        );
    };

    return (
        <>
            <AppealPageComponent
                isData={initialData.totalCount !== null || data.totalCount !== null}
                handleFilter={handleFilterClick}
                handleFilterDate={handleDateFilterClick}
                user={{ userId, userRole }}
                appeals={data.appeals.slice(itemOffset, endOffset)}
            />
            {getPagination(
                setItemOffset, data, initialData, name + "s",
                uriToGet, postDataAppeals, setPostData,
                undefined, filters
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