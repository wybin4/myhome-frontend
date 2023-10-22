import { Card, Tabs } from "@/components";
import { withLayout } from "@/layout/Layout";
import { useState } from "react";

function Appeal(): JSX.Element {
    const [activeTab, setActiveTab] = useState<number>(1);

    return (
        <>
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
                    titlePart={{
                        text: "№318",
                        tag: "В обработке",

                    }}
                    description="ТСЖ Прогресс · 23.03.2023"
                    text="Соседи сверху уже который день слушают громкую музыку по ночам. Сверху - это 13 квартира. Разберитесь, пожалуйста."
                    bottom={{ tag: "Претензия", attachment: "Вложение" }}
                />
            </Tabs>
        </>
    );
}

export default withLayout(Appeal);