import { API, api } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import { EventType, IGetAppeal, IGetEvents } from "@/interfaces/event.interface";
import { AppealPageComponent } from "@/page-components";

function Appeal({ data }: AppealProps): JSX.Element {
    const user = { // ИСПРАВИТЬ
        userId: 1,
        userRole: UserRole.ManagementCompany
    };

    return (
        <>
            <AppealPageComponent user={user} appeals={data.appeals} />
        </>
    );
}

export default withLayout(Appeal);

export async function getServerSideProps() {
    // ИСПРАВИТЬ!!!!
    const postData = {
        userId: 1,
        userRole: UserRole.ManagementCompany,
        events: [EventType.Appeal]
    };

    try {
        const { data } = await api.post<{ events: IGetEvents }>(API.event.get, postData);
        if (!data) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: { appeals: data.events.appeals }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface AppealProps extends Record<string, unknown> {
    data: { appeals: IGetAppeal[] };
    role: UserRole;
}