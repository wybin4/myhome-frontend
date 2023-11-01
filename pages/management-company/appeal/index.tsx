import { Table } from "@/components";
import { API } from "@/helpers/api";
import { UserRole, UserRoleType } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import { format } from "date-fns";
import { AppealStatus, AppealType } from "@/interfaces/event/appeal.interface";
import ProcessingIcon from "./processing.svg";
import ClosedIcon from "./closed.svg";
import RejectedIcon from "./rejected.svg";
import { formatFullName, formatNumber } from "@/helpers/constants";
import { EventType, IGetAppeal, IGetEvents } from "@/interfaces/event.interface";

function Appeal({ data }: AppealProps): JSX.Element {
    type AppealData = {
        id: number[];
        personalAccount: string[];
        modifiedPersonalAccount: string[];
        address: string[];
        type: string[];
        status: string[];
        createdAt: string[];
    };

    const initialData: AppealData = {
        id: [],
        personalAccount: [],
        modifiedPersonalAccount: [],
        address: [],
        type: [],
        status: [],
        createdAt: []
    };

    const appeals: AppealData = data.appeals.reduce(
        (accumulator, appeal) => {
            accumulator.id.push(appeal.id);
            accumulator.personalAccount.push(`${appeal.personalAccount} ${appeal.name}`);
            accumulator.modifiedPersonalAccount.push(`${formatNumber(
                appeal.personalAccount ?
                    appeal.personalAccount
                    : ""
            )} ${formatFullName(appeal.name)}`);
            const statusArr = Object.entries(AppealStatus).find(([key]) => key === appeal.status);
            let status: string;
            if (statusArr) {
                status = statusArr[1];
            } else {
                status = "";
            }
            accumulator.status.push(status);
            const typeArr = Object.entries(AppealType).find(([key]) => key === appeal.typeOfAppeal);
            let type: string;
            if (typeArr) {
                type = typeArr[1];
            } else {
                type = "";
            }
            accumulator.type.push(type);
            accumulator.address.push(appeal.address ? appeal.address : "");
            accumulator.createdAt.push(format(new Date(appeal.createdAt), "dd.MM.yyyy"));
            return accumulator;
        },
        initialData
    );

    const {
        id, personalAccount, modifiedPersonalAccount, type, status, address, createdAt
    } = appeals;

    return (
        <>
            <Table
                title="Обращения"
                filters={[
                    {
                        title: "Дата",
                        titleEng: "createdAt",
                        type: "date"
                    },
                    {
                        title: "Тип обращения",
                        titleEng: "type",
                        type: "checkbox",
                        items: type
                    },
                    {
                        title: "Статус",
                        titleEng: "status",
                        type: "checkbox",
                        items: status
                    }
                ]}
                rows={{
                    actions: {
                        actions: [{ type: "view", onClick: () => { }, id: 0 }]
                    },
                    ids: id,
                    items: [
                        {
                            title: "Лицевой счёт",
                            type: "text",
                            items: modifiedPersonalAccount,
                            infoItems: personalAccount
                        },
                        {
                            title: "Объект учёта",
                            type: "text",
                            items: address
                        },
                        {
                            title: "Тип обращения",
                            type: "text",
                            items: type
                        },
                        // {
                        //     title: "Подробности",
                        //     type: "text",
                        //     items: text
                        // },
                        // {
                        //     title: "Вложения",
                        //     type: "text",
                        //     items: text
                        // },
                        {
                            title: "Статус",
                            type: "icon",
                            items: status,
                            icons: [{
                                key: String(AppealStatus.Rejected),
                                icon: <RejectedIcon />
                            },
                            {
                                key: String(AppealStatus.Processing),
                                icon: <ProcessingIcon />
                            },
                            {
                                key: String(AppealStatus.Closed),
                                icon: <ClosedIcon />
                            }]
                        },
                        {
                            title: "Дата создания",
                            type: "text",
                            items: createdAt
                        },
                    ],
                    keyElements: {
                        first: [1], second: 3, tags: [2, 4, 5],
                        isSecondNoNeedTitle: true
                    },
                }} />
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
        const { data } = await axios.post<{ events: IGetEvents }>(API.event.get, postData);
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
    role: UserRoleType;
}