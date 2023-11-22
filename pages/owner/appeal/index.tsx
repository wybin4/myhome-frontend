import { AppContext, IAppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { IGetUserWithSubscriber } from "@/interfaces/account/user.interface";
import { EventType, IGetEvents, IGetAppeal } from "@/interfaces/event.interface";
import { withLayout } from "@/layout/Layout";
import { AppealPageComponent } from "@/page-components";
import { GetServerSidePropsContext } from "next";
import { useContext } from "react";

function Appeal({ data }: AppealProps): JSX.Element {
    const { userId, userRole } = useContext(AppContext);

    return (
        <>
            <AppealPageComponent user={{ userId, userRole }} users={data.users} appeals={data.appeals} />
        </>
    );
}

export default withLayout(Appeal);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const postDataEvents = {
        events: [EventType.Appeal]
    };

    try {
        const { props: eventProps } = await fetchReferenceData<{ events: IGetEvents }>(context, API.event.get, postDataEvents);
        const { props: userProps } = await fetchReferenceData<{ users: IGetUserWithSubscriber[] }>(context, API.common.user.get, undefined);

        if (!eventProps || !userProps) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    appeals: eventProps.data.events.appeals,
                    users: userProps.data.users
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
    };
}