import { Card, Htag, TableButton, TableFilter } from "@/components";
import { withLayout } from "@/layout/Layout";
import { useState, useRef } from "react";
import NotificationIcon from "./notification.svg";
import VotingIcon from "./voting.svg";
import cn from "classnames";

function Event(): JSX.Element {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const filterButtonRef = useRef(null);

    return (
        <>
            <div className={cn(
                "flex justify-between",
                "lg:flex-col lg:items-start",
                "md:flex-col md:items-center",
                "sm:flex-col sm:items-center"
            )}>
                <Htag size="h1" className="lg:mb-8 md:mb-4 sm:mb-4">События</Htag>
                <TableButton
                    buttons={[]}
                    isFiltersExist={true}
                    filterButtonRef={filterButtonRef}
                    isFilterOpened={isFilterOpened}
                    setIsFilterOpened={setIsFilterOpened}
                />
            </div>
            <div className="flex flex-row-reverse justify-end gap-[4vw]">
                <div>
                    <Htag size="h3" className="mb-4">Сегодня</Htag>
                    <Card
                        maxWidth="44.625rem"
                        titlePart={{
                            text: "Установка домофона с видеонаблюдением",
                            iconLeft: <VotingIcon />,
                            iconLeftSize: "l",
                            description: "ТСЖ Прогресс · Анонимный опрос до 30.10.2023"
                        }}
                        voting={{
                            options: [
                                { text: "За", id: 1 },
                                { text: "Против", id: 2 },
                                { text: "Воздержался", id: 3 },
                            ],
                            answers: [1, 2, 3],
                            onAnswer: (answerId: number) => console.log(answerId)
                        }}
                        bottom={{ text: "10:40 22 октября 2023" }}
                    />
                </div>
                <TableFilter
                    title="Фильтры"
                    items={[{
                        title: "Тип",
                        titleEng: "type",
                        type: "checkbox",
                        items: ["Опрос", "Уведомление"]
                    }, {
                        title: "Дата",
                        titleEng: "createdAt",
                        type: "date"
                    }
                    ]}

                    isOpen={isFilterOpened}
                    setIsOpen={setIsFilterOpened}

                    filterButtonRef={filterButtonRef}
                />
            </div>
        </>
    );
}

export default withLayout(Event);