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

        </div>
    );
}

export default withLayout(Home);