import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import { EventType, IGetAppeal, IGetEvents } from "@/interfaces/event.interface";
import { AppealPageComponent } from "@/page-components";
import { GetServerSidePropsContext } from "next";
import { fetchReferenceData } from "@/helpers/reference-constants";
import { AppContext } from "@/context/app.context";
import { useContext } from "react";

function Appeal({ data }: AppealProps): JSX.Element {
    const { userId, userRole } = useContext(AppContext);

    return (
        <>
            <AppealPageComponent user={{ userId, userRole }} appeals={data.appeals} />
        </>
    );
}

export default withLayout(Appeal);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const postData = {
        events: [EventType.Appeal]
    };

    const { props } = await fetchReferenceData<{ events: IGetEvents }>(context, API.event.get, postData);
    if (!props) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            data: {
                appeals: props.data.events.appeals
            }
        }
    };
}

interface AppealProps extends Record<string, unknown> {
    data: { appeals: IGetAppeal[] };
    userRole: UserRole;
    userId: number;
}