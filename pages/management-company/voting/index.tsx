import { Form, Table } from "@/components";
import { API } from "@/helpers/api";
import { UserRole, UserRole } from "@/interfaces/account/user.interface";
import { IVoting, VotingStatus } from "@/interfaces/event/voting.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import { format } from "date-fns";
import CloseIcon from "./close.svg";
import OpenIcon from "./open.svg";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IHouse } from "@/interfaces/reference/subscriber/house.interface";
import { EventType, IGetEvents, IGetVoting } from "@/interfaces/event.interface";

function Voting({ data }: IVotingProps): JSX.Element {
    const useFormData = useForm<IVoting>();
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);
    type VotingData = {
        id: number[];
        title: string[];
        createdAt: string[];
        expiredAt: string[];
        status: string[];
        houseName: string[];
        result: string[];
    };

    const initialData: VotingData = {
        id: [],
        title: [],
        createdAt: [],
        expiredAt: [],
        status: [],
        houseName: [],
        result: []
    };

    const votings: VotingData = data.votings.reduce(
        (accumulator, voting) => {
            accumulator.id.push(voting.id);
            accumulator.title.push(voting.title);
            const statusArr = Object.entries(VotingStatus).find(([key]) => key === voting.status);
            let status: string;
            if (statusArr) {
                status = statusArr[1];
            } else {
                status = "";
            }
            accumulator.status.push(status);
            accumulator.houseName.push(voting.name);
            accumulator.result.push(voting.result ? voting.result : "—");
            accumulator.createdAt.push(format(new Date(voting.createdAt), "dd.mm.yyyy"));
            accumulator.expiredAt.push(format(new Date(voting.expiredAt), "dd.mm.yyyy"));
            return accumulator;
        },
        initialData
    );

    const houses = data.houses.map(house => {
        return {
            value: house.id,
            text: `${house.city}, ${house.street} ${house.houseNumber}`
        };
    });

    const {
        id, title, status, result, houseName, createdAt, expiredAt
    } = votings;

    return (
        <>
            <Form<IVoting>
                successMessage={"Опрос добавлен"}
                successCode={201}
                additionalFormData={
                    [{ managementCompanyId: 1 }]
                }
                urlToPost={""}
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title={"Добавление опроса"}
                inputs={[
                    {
                        title: "Тема опроса",
                        inputType: "string",
                        id: "title",
                        type: "input",
                        numberInOrder: 2,
                        error: {
                            value: true, message: "Введите тему опроса"
                        }
                    }
                ]}
                selectors={[{
                    inputTitle: "Дом",
                    options: houses,
                    id: "houseId",
                    type: "select",
                    numberInOrder: 1,
                    error: {
                        value: true, message: "Выберите дом"
                    }
                }]}
                datePickers={[{
                    inputTitle: "Дата окончания",
                    id: "expiredAt",
                    type: "datepicker",
                    numberInOrder: 4,
                    error: {
                        value: true, message: "Введите дату окончания"
                    }
                }]}
            />
            <Table
                title="Опросы"
                filters={[
                    {
                        title: "Дата",
                        titleEng: "createdAt",
                        type: "date"
                    }
                ]}
                buttons={[{
                    type: "add",
                    title: "Добавить",
                    appearance: "primary",
                    onClick: () => setIsFormOpened(true)
                }]}
                rows={{
                    actions: {
                        actions: [{ id: 0, type: "view", onClick: () => { } }]
                    },
                    ids: id,
                    items: [
                        {
                            title: "Тема",
                            type: "text",
                            items: title
                        },
                        {
                            title: "Статус",
                            type: "icon",
                            items: status,
                            icons: [{
                                key: String(VotingStatus.Close),
                                icon: <CloseIcon />
                            },
                            {
                                key: String(VotingStatus.Open),
                                icon: <OpenIcon />
                            }]
                        },
                        {
                            title: "Дом",
                            type: "text",
                            items: houseName
                        },
                        {
                            title: "Результат",
                            type: "text",
                            items: result
                        },
                        {
                            title: "Дата начала",
                            type: "text",
                            items: createdAt
                        },
                        {
                            title: "Дата окончания",
                            type: "text",
                            items: expiredAt
                        }
                    ],
                    keyElements: { first: [3], second: 1, isSecondNoNeedTitle: true }
                }} />
        </>
    );
}

export default withLayout(Voting);

export async function getServerSideProps() {
    // ИСПРАВИТЬ!!!!
    const postDataHouses = {
        userId: 1,
        userRole: UserRole.ManagementCompany,
    };
    const postDataVotings = {
        userId: 1,
        userRole: UserRole.ManagementCompany,
        events: [EventType.Voting]
    };
    try {
        const votings = await axios.post<{ events: IGetEvents }>(API.event.get, postDataVotings);
        const houses = await axios.post<{ houses: IHouse[] }>(API.managementCompany.reference.house.get, postDataHouses);
        if (!votings.data || !houses.data) {
            return {
                notFound: true
            };
        }
        return {
            props: {
                data: {
                    votings: votings.data.events.votings,
                    houses: houses.data.houses
                }
            }
        };
    } catch {
        return {
            notFound: true
        };
    }
}

interface IVotingProps extends Record<string, unknown> {
    data: { votings: IGetVoting[]; houses: IHouse[] };
    role: UserRole;
}