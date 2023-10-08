import { Button, Htag, TableFilter, TableRow } from "@/components";
import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { ISubscriberReferenceData } from "@/interfaces/reference/subscriber/subscriber.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import { Dispatch, SetStateAction, useRef, useState } from "react";

function GetSPD({ data }: IGetSPDProps): JSX.Element {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterButtonRef = useRef(null);
    const [isHouses, setIsHouses] = useState<boolean>(true);

    return (
        <>
            <Htag size="h1">Единый платёжный документ</Htag>
            <Button
                symbol="calculate" size="m" appearance="primary"
            >Сформировать</Button>
            <Button
                symbol="add" size="m" appearance="ghost"
            >Выбрать</Button>
            <span className="hidden lg:block md:block sm:block">
                <Button
                    symbol="filter"
                    size="m"
                    appearance="ghost"
                    onClick={() => setIsFilterOpened(!isFilterOpened)}
                    innerRef={filterButtonRef}
                >
                    Фильтры
                </Button>
            </span>
            <TableRow
                actions={[]}
                keyElements={{ first: [0], second: 1, isSecondNoNeedTitle: true }}
                items={
                    isHouses ? [{
                        title: "Дома",
                        type: "text",
                        items: data.subscribers.map(subscriber => {
                            return subscriber.houseName;
                        })
                    }] : [
                        {
                            title: "ФИО",
                            type: "text",
                            items: data.subscribers.map(subscriber => {
                                return subscriber.ownerName;
                            })
                        },
                        {
                            title: "Лицевой счет",
                            type: "text",
                            items: data.subscribers.map(subscriber => {
                                return subscriber.personalAccount;
                            })
                        },
                    ]
                }
            />
            <TableFilter title="Параметры" items={[
                {
                    title: "Способ начисления",
                    titleEng: "accrualMethod",
                    type: "checkboxWithoutSearch",
                    isRadio: true,
                    items: ["По домам", "По лицевым счетам"],
                    onClick: () => setIsHouses(!isHouses),
                },
                {
                    title: "Начисление пени",
                    titleEng: "isPenalty",
                    type: "checkboxWithoutSearch",
                    isRadio: true,
                    items: ["Выполнять", "Не выполнять"]
                },
                {
                    title: "Штрих-код",
                    titleEng: "isBarcode",
                    type: "checkboxWithoutSearch",
                    isRadio: true,
                    items: ["Формировать", "Не формировать"]
                },
                {
                    title: "Поверка",
                    titleEng: "issue",
                    type: "number",
                    numberText: "Предупреждать за (в мес)"
                },
            ]} isOpen={isFilterOpened} setIsOpen={setIsFilterOpened} filterButtonRef={filterButtonRef} />
        </>
    );
}

export default withLayout(GetSPD);

export async function getServerSideProps() {
    const apiUrl = API.managementCompany.reference["subscriber"].get;
    const postData = {
        managementCompanyId: 1
    };

    try {
        const { data } = await axios.post<{ data: ISubscriberReferenceData }>(apiUrl, postData);
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

interface IGetSPDProps extends Record<string, unknown> {
    data: ISubscriberReferenceData;
    role: UserRole;
    isFormOpened: boolean;
    setIsFormOpened: Dispatch<SetStateAction<boolean>>;
}