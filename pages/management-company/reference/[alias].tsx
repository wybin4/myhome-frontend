import { Form, Table } from "@/components";
import { AppContext } from "@/context/app.context";
import { IMCAddHouseForm } from "@/interfaces/reference/subscriber/house.interface";
import { withLayout } from "@/layout/Layout";
import { useContext } from "react";
import { useForm } from "react-hook-form";

function ReferencePage(): JSX.Element {
    const useFormData = useForm<IMCAddHouseForm>();
    const { isFormOpened, setIsFormOpened } = useContext(AppContext);

    return (
        <>
            <Form
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title="Добавление дома"
                inputs={[
                    {
                        id: "city", type: "input", size: "m", title: "Город", numberInOrder: 1,
                        error: { value: true, message: "Заполните название города" }
                    },
                    {
                        id: "street", type: "input", size: "m", title: "Улица", numberInOrder: 2,
                        error: { value: true, message: "Заполните название улицы" }
                    },
                    {
                        id: "numberOfHouse", type: "input", size: "m", title: "Номер дома", numberInOrder: 3,
                        error: { value: true, message: "Заполните номер дома " }
                    }
                ]}
            >
            </Form>
            <Table
                title="Дома"
                buttons={[{ type: "download" }, { type: "upload" }, { type: "add", onClick: () => setIsFormOpened(!isFormOpened) }]}
                filters={[
                    {
                        type: "checkbox",
                        title: "Тип услуги",
                        titleEng: "typeOfService",
                        items: ["Вывоз ТБО", "СодОбщИмущ", "Техобслуж"]
                    },
                    {
                        type: "checkboxWithoutSearch",
                        title: "Способ начисления",
                        titleEng: "accrualAbility",
                        items: ["По домам", "По лицевым счетам"],
                        radio: true
                    },
                    {
                        type: "date",
                        title: "Расчётный период",
                        titleEng: "billingPeriod"
                    }
                ]}
                rows={{
                    actions: ["editAndSave", "delete", "addComment", "download"],
                    items:
                        [
                            {
                                title: "Тема",
                                type: "text",
                                items: [
                                    "Установка домофона с видеонаблюдением",
                                    "Тариф на общедомовое имущество",
                                    "Ежеквартальное собрание"
                                ]
                            },
                            {
                                title: "Статус",
                                type: "tag",
                                items: [
                                    "Открыт",
                                    "Закрыт",
                                    "Закрыт"
                                ]
                            },
                            {
                                title: "Вложения",
                                type: "attachment",
                                items: [
                                    undefined,
                                    "Акт поверки",
                                    "Паспорт счётчика"
                                ]
                            },
                        ]
                }}
            />
        </>
    );
}

export default withLayout(ReferencePage);