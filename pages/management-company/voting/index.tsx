/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/helpers/api";
import { IVotingReferenceData, IVotingReferenceDataItem, votingPageComponent } from "@/interfaces/event/voting.interface";
import { withLayout } from "@/layout/Layout";
import { IHouse } from "@/interfaces/reference/subscriber/house.interface";
import { EventType, IGetEvents } from "@/interfaces/event.interface";
import { enrichReferenceComponent, fetchReferenceData } from "@/helpers/reference-constants";
import { GetServerSidePropsContext } from "next";
import { IAppContext } from "@/context/app.context";
import { ReferencePageComponent } from "@/page-components";
import { useState } from "react";

function Voting({ data: initialData }: IVotingProps): JSX.Element {
    const [data, setData] = useState(initialData);

    const getItem = () => {
        const votings = data.votings.sort((b, a) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const newItem = enrichReferenceComponent({ votings }, votingPageComponent, "voting");
        return (
            <ReferencePageComponent<IVotingReferenceDataItem>
                item={newItem}
                uriToAdd={API.managementCompany.voting.add}
                additionalSelectorOptions={data.additionalData}
                setPostData={setPostData}
                addMany={false}
            />

        );
    };

    const setPostData = (newData: any) => {
        setData(prevData => {
            const { votings, ...rest } = prevData;
            if (votings.length) {
                const votings = [...prevData.votings, newData.voting];
                return { votings, ...rest } as IVotingReferenceData & {
                    additionalData: {
                        data: Record<string, string | number>[];
                        id: string;
                    }[]
                };
            } else {
                const votings = [newData.voting];
                return { votings, ...rest } as IVotingReferenceData & {
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

export default withLayout(Voting);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const postDataVotings = {
        events: [EventType.Voting]
    };

    try {
        const { props: votingProps } = await fetchReferenceData<{ events: IGetEvents }>(context, API.event.get, postDataVotings);
        const { props: houseProps } = await fetchReferenceData<{ houses: IHouse[] }>(context, API.reference.house.get, { "isAllInfo": true });
        if (!votingProps || !houseProps) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    votings: ('events' in votingProps.data) ? votingProps.data.events.votings : [],
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

interface IVotingProps extends Record<string, unknown>, IAppContext {
    data: IVotingReferenceData & { additionalData: { data: Record<string, string | number>[]; id: string }[] };
}