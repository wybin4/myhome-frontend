import { API } from "@/helpers/api";
import { UserRole, IGetUserWithSubscriber, UserRole } from "@/interfaces/account/user.interface";
import { EventType, IGetEvents, IGetAppeal } from "@/interfaces/event.interface";
import { withLayout } from "@/layout/Layout";
import { AppealPageComponent } from "@/page-components";
import axios from "axios";

function Appeal({ data }: AppealProps): JSX.Element {
    const user = { // ИСПРАВИТЬ
        userId: 1,
        userRole: UserRole.Owner
    };

    return (
        <>
            <AppealPageComponent user={user} users={data.users} appeals={data.appeals} />
        </>
    );
}

export default withLayout(Appeal);

export async function getServerSideProps() {
    // ИСПРАВИТЬ!!!!
    const postDataEvents = {
        userId: 1,
        userRole: UserRole.Owner,
        events: [EventType.Appeal]
    };
    const postDataUsers = {
        userId: 1,
        userRole: UserRole.Owner,
    };


    try {
        const events = await axios.post<{ events: IGetEvents }>(API.event.get, postDataEvents);
        const users = await axios.post<{ users: IGetUserWithSubscriber[] }>(API.common.owner.get, postDataUsers);

        if (!events || !users) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    appeals: events.data.events.appeals,
                    users: users.data.users
                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface AppealProps extends Record<string, unknown> {
    data: {
        appeals: IGetAppeal[];
        users: IGetUserWithSubscriber[];
    };
    role: UserRole;
}