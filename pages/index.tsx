import { withLayout } from "@/layout/Layout";

function Home(): JSX.Element {

    // const options = [
    //     { value: 'option1', text: 'Option 1' },
    //     { value: 'option2', text: 'Option 2' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    //     { value: 'option3', text: 'Option 3' },
    // ];

    return (
        <div>
            {/* <ReferenceMenu items={[
                { title: "Дома", text: "Добавление и изменение данных", icon: <HouseIcon /> },
                { title: "Жилые помещения", text: "Добавление и изменение данных", icon: <ApartmentIcon /> },
                { title: "Собственники", text: "Добавление и изменение данных", icon: <SubscriberIcon /> },
                { title: "Лицевые счета", text: "Добавление и изменение Лицевых счетов", icon: <SubscriberIcon /> },
            ]} title={"Абоненты"} /> */}
            {/* <TableFilter title={"Фильтры"} items={[
                {
                    type: "checkbox",
                    title: "Тип услуги", titleEng: "typeOfService",
                    items: ["Вывоз ТБО", "СодОбщИмущ", "Техобслуж"]
                }, {
                    type: "checkboxWithoutSearch",
                    title: "Способ начисления", titleEng: "accrualAbility",
                    items: ["По домам", "По лицевым счетам"],
                    radio: true
                },
                {
                    type: "date",
                    title: "Расчётный период", titleEng: "billingPeriod",
                },
            ]} /> */}
            {/* <Select id="select1" options={options} title="ФИО" /> */}
            {/* <TableRow
                startIcon={<PDFIcon />}
                actions={["editAndSave", "delete", "addComment", "download"]}
                items={[
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
                ]} /> */}
            {/* <Table
                title="Лицевые счета"
                buttonTypes={["download", "upload", "add"]}
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
                    startIcon: < PDFIcon />,
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
            /> */}
 
        </div>
    );
}

export default withLayout(Home);