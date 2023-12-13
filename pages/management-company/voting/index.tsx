/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { API, api } from "@/helpers/api";
import { IVotingReferenceData, IVotingReferenceDataItem, votingPageComponent } from "@/interfaces/event/voting.interface";
import { withLayout } from "@/layout/Layout";
import { IHouse } from "@/interfaces/reference/subscriber/house.interface";
import { EventType, IGetEvents } from "@/interfaces/event.interface";
import { enrichReferenceComponent, fetchReferenceData, handleFilter } from "@/helpers/reference-constants";
import { GetServerSidePropsContext } from "next";
import { IAppContext } from "@/context/app.context";
import { ReferencePageComponent } from "@/page-components";
import { useState } from "react";
import { PAGE_LIMIT } from "@/helpers/constants";
import { getPagination, setPostDataForEvent } from "../reference-helper";

const postDataVotings = {
    events: [EventType.Voting]
};
const uriToGet = API.event.get;
const name = "voting";

function Voting({ data: initialData }: IVotingProps): JSX.Element {
    const [data, setData] = useState(initialData);
    const [itemOffset, setItemOffset] = useState(0);

    const getItem = () => {
        const endOffset = itemOffset + PAGE_LIMIT;
        const votings = data.votings.sort((b, a) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const newItem = enrichReferenceComponent({ votings }, votingPageComponent, name, itemOffset, endOffset);

        return (
            <>
                <ReferencePageComponent<IVotingReferenceDataItem>
                    item={newItem}
                    uriToAdd={API.managementCompany.voting.add}
                    additionalSelectorOptions={data.additionalData}
                    setPostData={setPostData}
                    addMany={false}
                    isData={initialData.totalCount !== null || data.totalCount !== null}
                    handleFilter={async (value: string[], id: string) => {
                        await handleFilter(
                            value, id,
                            uriToGet, postDataVotings, setPostData,
                            setItemOffset
                        );
                    }}
                />
                {getPagination(
                    setItemOffset, data, initialData, name + "s",
                    uriToGet, postDataVotings, setPostData
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

export default withLayout(Voting);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const { props: votingProps } = await fetchReferenceData<{ events: IGetEvents }>(context, uriToGet, postDataVotings, true);
        const { props: houseProps } = await fetchReferenceData<{ houses: IHouse[] }>(context, API.reference.house.get, { "isAllInfo": true });
        if (!votingProps || !houseProps) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    votings: ('events' in votingProps.data) ? votingProps.data.events.votings.votings : null,
                    additionalData: [
                        {
                            data: ('houses' in houseProps.data) ? houseProps.data.houses : [],
                            id: 'houseId'
                        }
                    ],
                    totalCount: ('events' in votingProps.data && votingProps.data.events.votings.totalCount) ? votingProps.data.events.votings.totalCount : null,

                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface IVotingProps extends Record<string, unknown>, IAppContext {
    data: IVotingReferenceData & {
        additionalData: {
            data: Record<string, string | number>[];
            id: string
        }[];
        totalCount?: number;
    };
}