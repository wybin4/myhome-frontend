import { Card, InfoWindow, Tabs } from "@/components";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";
import ProcessingIcon from "./processing.svg";
import ClosedIcon from "./closed.svg";
import RejectedIcon from "./rejected.svg";
import ArrowIcon from "./arrow.svg";

function Appeal(): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);

    return (
        <>
            <InfoWindow
                title="Претензия №318"
                description="ТСЖ Прогресс | 23.03.2023"
                text="Соседи сверху уже который день слушают громкую музыку по ночам. Сверху - это 13 квартира. Разберитесь, пожалуйста."
                tags={["В обработке", "Претензия"]}
                isOpen={isInfoWindowOpen}
                setIsOpen={setIsInfoWindowOpen}
                buttons={[{ name: "Скачать вложение", onClick: () => { } }]}
            />
            <Tabs
                title="Обращения"
                tabs={[
                    { id: 1, name: "Все" },
                    { id: 2, name: "В обработке" },
                    { id: 3, name: "Обработанные" },
                    { id: 4, name: "Отклоненные" },
                ]}
                activeTab={activeTab} setActiveTab={setActiveTab}
            >
                <Card
                    maxWidth="38.375rem"
                    titlePart={{
                        text: "№318",
                        tag: {
                            tag: "В обработке",
                            tagIcon: <ProcessingIcon />
                        },
                        description: "ТСЖ Прогресс · 23.03.2023",
                        symbolRight: {
                            symbol: <span className="viewAction"><ArrowIcon /></span>,
                            size: "l",
                            onClick: () => {
                                setIsInfoWindowOpen(!isInfoWindowOpen);
                            }
                        },
                    }}
                    text="Соседи сверху уже который день слушают громкую музыку по ночам. Сверху - это 13 квартира. Разберитесь, пожалуйста."
                    isMobileText={false}
                    bottom={{ tag: "Претензия", attachment: "Вложение" }}
                />
            </Tabs>
        </>
    );
}

export default withLayout(Appeal);