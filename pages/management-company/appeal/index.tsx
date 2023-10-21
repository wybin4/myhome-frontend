import { Table } from "@/components";
import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import { format } from "date-fns";
import { AppealStatus, IAppeal } from "@/interfaces/appeal.interface";
import ProcessingIcon from "./processing.svg";
import ClosedIcon from "./closed.svg";
import RejectedIcon from "./rejected.svg";
import { formatFullName, formatNumber } from "@/helpers/constants";

function Appeal({ data }: AppealProps): JSX.Element {
    type AppealData = {
        id: number[];
        personalAccount: string[];
        modifiedPersonalAccount: string[];
        apartmentName: string[];
        type: string[];
        status: string[];
        createdAt: string[];
    };

    const initialData: AppealData = {
        id: [],
        personalAccount: [],
        modifiedPersonalAccount: [],
        apartmentName: [],
        type: [],
        status: [],
        createdAt: []
    };

    const appeals: AppealData = data.appeals.reduce(
        (accumulator, appeal) => {
            accumulator.id.push(appeal.id);
            accumulator.personalAccount.push(`${appeal.personalAccount} ${appeal.ownerName}`);
            accumulator.modifiedPersonalAccount.push(`${formatNumber(appeal.personalAccount)} ${formatFullName(appeal.ownerName)}`);
            const statusArr = Object.entries(AppealStatus).find(([key]) => key === appeal.status);
            let status: string;
            if (statusArr) {
                status = statusArr[1];
            } else {
                status = "";
            }
            accumulator.status.push(status);
            accumulator.type.push(appeal.typeOfAppealName);
            accumulator.apartmentName.push(appeal.apartmentName);
            accumulator.createdAt.push(format(new Date(appeal.createdAt), "dd.MM.yyyy"));
            return accumulator;
        },
        initialData
    );

    const {
        id, personalAccount, modifiedPersonalAccount, type, status, apartmentName, createdAt
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
                            items: apartmentName
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
    const postData = {
        managementCompanyId: 1 // ИСПРАВИТЬ!!!!
    };

    try {
        const { data } = await axios.post<{ appeals: AppealData[] }>(API.managementCompany.appeal.get, postData);
        if (!data) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface AppealProps extends Record<string, unknown> {
    data: { appeals: AppealData[] };
    role: UserRole;
}

interface AppealData extends IAppeal {
    typeOfAppealName: string;
    apartmentName: string;
    personalAccount: string;
    ownerName: string;
}