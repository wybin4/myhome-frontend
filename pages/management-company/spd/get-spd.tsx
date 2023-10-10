import { Htag, SelectionForm, TableButton, TableFilter, TableRow } from "@/components";
import { AppContext } from "@/context/app.context";
import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import { ISubscriberReferenceData, ISubscriberReferenceDataItem } from "@/interfaces/reference/subscriber/subscriber.interface";
import { withLayout } from "@/layout/Layout";
import axios from "axios";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import HouseIcon from "./icons/house.svg";
import { SelectionDataItem, SelectionFormProps } from "@/components/enhanced/Form/Form.props";

type GroupedSubscriber = {
    houseId: number,
    subscribers: ISubscriberReferenceDataItem[]
};

function GetSPD({ data }: IGetSPDProps): JSX.Element {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterButtonRef = useRef(null);
    const [isHouses, setIsHouses] = useState<boolean>(true);
    const { isFormOpened, setIsFormOpened } = useContext(AppContext);

    const getUnique = () => {
        const uniqueHouseIds = new Set<number>();
        return data.subscribers.filter(subscriber => {
            if (!uniqueHouseIds.has(subscriber.houseId)) {
                uniqueHouseIds.add(subscriber.houseId);
                return true;
            }
            return false;
        });
    };

    const group = (
        subscribers: ISubscriberReferenceDataItem[]
    ): GroupedSubscriber[] => {
        return Object.entries(
            subscribers.reduce((acc, subscriber) => {
                const { houseId } = subscriber;

                if (!acc[houseId]) {
                    acc[houseId] = [];
                }

                acc[houseId].push(subscriber);

                return acc;
            }, {} as Record<number, ISubscriberReferenceDataItem[]>)
        ).map(([houseId, subscribers]) => ({ houseId: Number(houseId), subscribers }));
    };

    const ungroup = (subscribers: GroupedSubscriber[]) => {
        return subscribers.map(group => group.subscribers).flat();
    };

    const filter = () => {
        if (isHouses) {
            return getUnique().filter(subscriber =>
                formCheckedIds.includes(subscriber.houseId)
            );
        } else {
            return group(data.subscribers.filter(subscriber =>
                formCheckedIds.includes(subscriber.id)
            ));
        }
    };

    const getStartCheckedIds = () => {
        return isHouses
            ? getUnique().map(u => u.houseId)
            : group(data.subscribers)
                .flatMap(g =>
                    g.subscribers.map(subscriber => subscriber.id)
                );
    };

    const [formCheckedIds, setFormCheckedIds] = useState<number[]>(
        getStartCheckedIds()
    );

    useEffect(() => {
        setFormCheckedIds(getStartCheckedIds);
    }, [isHouses]);

    const selectionFormData = (): SelectionFormProps => {
        return {
            title: isHouses ? "Выбор дома" : "Выбор лицевых счетов",
            data: isHouses ? {
                dataType: "flat",
                items: getUnique().map(subscriber => {
                    return {
                        value: subscriber.houseName,
                        id: subscriber.houseId
                    };
                })
            } : {
                dataType: "nested",
                items: group(data.subscribers).map(house => {
                    return {
                        title: house.subscribers[0].houseName,
                        icon: <HouseIcon />,
                        values: house.subscribers.map(s => {
                            return {
                                value: `${formatNumber(s.personalAccount)}, ${s.ownerName}`,
                                id: s.id
                            };
                        }) as SelectionDataItem[]
                    };
                })
            },
            isOpened: isFormOpened, setIsOpened: setIsFormOpened,
            checkedIds: formCheckedIds,
            setCheckedIds: setFormCheckedIds
        };
    };

    const formatNumber = (number: string) => {
        const length = 7;
        if (number.length <= length) {
            return number;
        }
        const truncatedString = number.slice(0, length - 3);
        return `${truncatedString}...${number.slice(-1)}`;
    };

    return (
        <>
            <SelectionForm
                {...selectionFormData()}
            />
            <>
                <div className="flex justify-between lg:flex-col lg:items-start md:flex-col md:items-center">
                    <Htag size="h1"
                        className="mb-16 lg:mb-8 md:mb-4 sm:mb-4 md:text-center sm:text-center"
                    >Единый платёжный документ</Htag>
                    <TableButton
                        buttons={[{
                            type: "add",
                            title: "Сформировать", appearance: "ghost",
                            onClick: () => setIsFormOpened(!isFormOpened)
                        }]}
                        filterAppearance="primary"
                        isFiltersExist={true}
                        isFilterOpened={isFilterOpened} setIsFilterOpened={setIsFilterOpened}
                        filterButtonRef={filterButtonRef} />
                </div>
                <TableRow
                    actions={[]}
                    keyElements={{ first: [0], second: 1, isSecondNoNeedTitle: true }}
                    items={
                        isHouses ? [{
                            title: "Дома",
                            type: "text",
                            items: (filter() as ISubscriberReferenceDataItem[]).
                                map(subscriber => {
                                    return subscriber.houseName;
                                })
                        }] : [
                            {
                                title: "ФИО",
                                type: "text",
                                items: ungroup(filter() as GroupedSubscriber[]).
                                    map(subscriber => subscriber.ownerName)
                            },
                            {
                                title: "Лицевой счет",
                                type: "text",
                                items: ungroup(filter() as GroupedSubscriber[]).
                                    map(subscriber => subscriber.personalAccount)
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