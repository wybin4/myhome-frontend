import { Htag, SerialForm, SelectionForm, TableButton, TableFilter, TableRow, PopUp, InfoForm, Pdf } from "@/components";
import { ISubscriberReferenceDataItem } from "@/interfaces/reference/subscriber/subscriber.interface";
import { useEffect, useRef, useState } from "react";
import HouseIcon from "./house.svg";
import { SelectionDataItem, SelectionFormProps } from "@/components/enhanced/Form/Form.props";
import { GetSPDPageComponentProps } from "./GetSPDPageComponent.props";
import styles from "./GetSPDPageComponent.module.css";
import { formatNumber } from "@/helpers/constants";

type GroupedSubscriber = {
    houseId: number,
    subscribers: ISubscriberReferenceDataItem[]
};

export const GetSPDPageComponent = ({
    data, fetchSPD,
    fetchKeyRate, keyRate, setKeyRate, cantGetKeyRate, setCantGetKeyRate,
    spdError, pdf,
    formCheckedIds, setFormCheckedIds,
    isHouses, setIsHouses
}: GetSPDPageComponentProps): JSX.Element => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterButtonRef = useRef(null);
    const additionalRef = useRef(null);
    const [isCheckboxFormOpened, setIsCheckboxFormOpened] = useState<boolean>(false);
    const [activeForm, setActiveForm] = useState<number>(0);

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
            isOpened: isCheckboxFormOpened, setIsOpened: setIsCheckboxFormOpened,
            checkedIds: formCheckedIds,
            setCheckedIds: setFormCheckedIds
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            let kr;

            switch (activeForm) {
                case 4:
                    kr = await fetchKeyRate();
                    break;
            }

            if (kr && kr.keyRate) {
                setKeyRate(kr.keyRate);
            }
        };

        fetchData();
    }, [activeForm]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cantGetKeyRate) {
            timer = setTimeout(() => {
                setCantGetKeyRate(false);
            }, 5000);
        }

        return () => clearTimeout(timer);
    }, [cantGetKeyRate]);

    return (
        <>
            <PopUp
                popupRef={additionalRef}
                isOpen={cantGetKeyRate}
                setIsOpen={setCantGetKeyRate}
                type="link-failure" link="https://www.cbr.ru/hd_base/KeyRate/">
                Не удалось получить данные о ключевой ставке с сайта Центробанка
            </PopUp>
            <PopUp type="failure"
                isOpen={spdError ? true : false}
                setIsOpen={() => spdError ? true : false}
            >
                {spdError}
            </PopUp>
            <SerialForm title="Проверьте данные о муниципальных тарифах"
                data={{
                    dataType: "scroll",
                    items: data.municipalTariffs.map(mt => {
                        return {
                            value: String(mt.typeOfServiceName) || "",
                            description: `${mt.norm} ${mt.unitName}` || ""
                        };
                    })
                }}
                activeForm={activeForm}
                setActiveForm={setActiveForm}
                number={1}
            />
            <SerialForm title="Проверьте данные о тарифах на общедомовые нужды" data={{
                dataType: "scroll",
                items:
                    data.commonHouseNeeds.map(chn => {
                        return {
                            value: String(chn.typeOfServiceName) || "",
                            description: `${chn.multiplier} ${chn.unitName}` || ""
                        };
                    })
            }}
                activeForm={activeForm}
                setActiveForm={setActiveForm}
                number={2}
            />
            <SerialForm title="Проверьте данные о нормативах" data={{
                dataType: "scroll",
                items: data.norms.map(n => {
                    return {
                        value: String(n.typeOfServiceName) || "",
                        description: `${n.norm} ${n.unitName}` || ""
                    };
                })
            }}
                activeForm={activeForm}
                setActiveForm={setActiveForm}
                number={3}
            />
            <SerialForm title="Ключевая ставка" data={{
                dataType: "pick",
                inputType: "number",
                placeholder: 13,
                id: "keyRate",
                error: {
                    value: true, message: "Заполните ключевую ставку"
                },
                value: keyRate,
                description: "*данные о ключевой ставке получены с сайта Центробанка"
            }}
                activeForm={activeForm}
                setActiveForm={setActiveForm}
                number={4}
                setFormValue={async (value: number | string) => {
                    if (typeof value === "number") {
                        setKeyRate(value);
                        fetchSPD(value);
                    }
                }}
                additionalRef={additionalRef}
            />
            {!spdError &&
                <InfoForm
                    title="Формирование ЕПД окончено"
                    text="Вы можете скачать полученные ЕПД или просмотреть их в браузере"
                    icon="success"
                    buttons={[
                        {
                            name: "Скачать", onClick: () => {
                                if (pdf.pdfUrl.url !== "") {
                                    const a = document.createElement('a');
                                    a.href = pdf.pdfUrl.url;
                                    a.download = String(Date.now());
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(pdf.pdfUrl.url);
                                }
                            }
                        },
                        { name: "Просмотреть", onClick: () => "" },
                    ]}
                    activeForm={activeForm}
                    setActiveForm={setActiveForm}
                    number={5}
                />
            }
            <SelectionForm
                {...selectionFormData()}
            />
            <>
                {pdf.pdfUrl.url !== "" && <Pdf {...pdf} />}
                {pdf.pdfUrl.url === "" &&
                    <>
                        <div className={styles.topPart}>
                            <Htag size="h1" className={styles.title}>Единый платёжный документ</Htag>
                            <TableButton
                                buttons={[{
                                    type: "add",
                                    title: "Выбрать", appearance: "ghost",
                                    onClick: () => setIsCheckboxFormOpened(!isCheckboxFormOpened)
                                },
                                {
                                    type: "calculate",
                                    title: "Сформировать", appearance: "primary",
                                    onClick: () => setActiveForm(1)
                                }]}
                                filterAppearance="ghost"
                                isFiltersExist={true}
                                isFilterOpened={isFilterOpened} setIsFilterOpened={setIsFilterOpened}
                                filterButtonRef={filterButtonRef} />
                        </div>
                        <div className={styles.bottomPart}>
                            <div className="w-full">
                                <TableRow
                                    keyElements={{ first: [0], second: 1, isSecondNoNeedTitle: true }}
                                    items={isHouses ? [{
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
                                    ]} ids={[]} />
                            </div>
                            <TableFilter title="Параметры" items={[
                                {
                                    title: "Способ начисления",
                                    titleEng: "accrualMethod",
                                    type: "checkboxWithoutSearch",
                                    isRadio: true,
                                    items: [{
                                        value: "byHouses",
                                        text: "По домам"
                                    },
                                    {
                                        value: "bySubscribers",
                                        text: "По лицевым счетам"
                                    }],
                                    onClick: () => setIsHouses(!isHouses),
                                },
                                {
                                    title: "Начисление пени",
                                    titleEng: "isPenalty",
                                    type: "checkboxWithoutSearch",
                                    isRadio: true,
                                    items: [{
                                        value: "with",
                                        text: "Выполнять"
                                    },
                                    {
                                        value: "without",
                                        text: "Не выполнять"
                                    }]
                                },
                                {
                                    title: "Штрих-код",
                                    titleEng: "isBarcode",
                                    type: "checkboxWithoutSearch",
                                    isRadio: true,
                                    items: [{
                                        value: "with",
                                        text: "Формировать"
                                    },
                                    {
                                        value: "without",
                                        text: "Не формировать"
                                    }]
                                },
                                {
                                    title: "Поверка",
                                    titleEng: "issue",
                                    type: "number",
                                    numberText: "Предупреждать за (в мес)"
                                },
                            ]} isOpen={isFilterOpened} setIsOpen={setIsFilterOpened} filterButtonRef={filterButtonRef} isOne={true} />
                        </div>
                    </>
                }
            </>
        </>
    );
};
