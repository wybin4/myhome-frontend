import { ReferencePageComponentProps } from "./ReferencePageComponent.props";
// import styles from "./ReferencePageComponent.module.css";
import { Form, Table } from "@/components";
import { AppContext } from "@/context/app.context";
import { useContext } from "react";
import { FieldValues, useForm } from "react-hook-form";
import RussianNounsJS from "russian-nouns-js";
import { Gender } from "russian-nouns-js/src/Gender";
import { IReferenceTitle } from "@/interfaces/reference/page.interface";
import { DatePickerFormProps, InputFormProps, SelectorFormProps } from "@/components/enhanced/Form/Form.props";
// import cn from 'classnames';

export const ReferencePageComponent = <T extends FieldValues>({
    item,
    uriToAdd,
    // uriToAddMany
    // className, ...props
}: ReferencePageComponentProps<T>): JSX.Element => {
    const useFormData = useForm<T>();
    const { isFormOpened, setIsFormOpened } = useContext(AppContext);

    const rne = new RussianNounsJS.Engine();

    const noun = item.rusName;
    const gender = item.gender;
    // const nominative = rne.decline({ text: noun, gender }, "именительный");
    const pluralNominative = (
        title: IReferenceTitle[], gender: Gender[keyof Gender]
    ) => {
        return title.map(word => {
            if (word.isChangeable) {
                return rne.pluralize({ text: word.word, gender })[0];
            } else return word.word;
        }).join(" ");
    };
    const getCase = (
        title: IReferenceTitle[],
        gender: Gender[keyof Gender],
        caseName: string,
    ) => {
        return title.map(word => {
            if (word.isChangeable) {
                return rne.decline({
                    text: word.word,
                    gender: gender
                }, caseName)[0];
            } else return word.word;
        }).join(" ");
    };

    const phraseByArr = (arr: IReferenceTitle[]) => {
        return arr.map(i => i.word).join(" ");
    };
    const capFirstLetter = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    const inputs: InputFormProps<T>[] =
        item.components.filter(c => c.type === "input")
            .map(component => {
                return {
                    title: capFirstLetter(phraseByArr(component.title)),
                    size: "m",
                    inputType: component.inputType ? component.inputType : "string",
                    numberInOrder: component.numberInOrder,
                    id: component.id,
                    type: "input",
                    error: {
                        value: true, message: `Заполните ${getCase(
                            component.title, component.gender, "винительный"
                        )}`
                    }
                };
            });

    const selectors: SelectorFormProps<T>[] = item.components
        .filter(c => c.type === "select")
        .map(component => {
            return {
                size: "m",
                inputTitle: capFirstLetter(phraseByArr(component.title)),
                options: component.selectorOptions ? component.selectorOptions : [],

                id: component.id,
                type: "select",
                numberInOrder: component.numberInOrder,
                error: {
                    value: true, message: `Выберите ${getCase(
                        component.title, component.gender, "винительный"
                    )}`
                }
            };
        });

    const datePickers: DatePickerFormProps<T>[] = item.components
        .filter(c => c.type === "datepicker")
        .map(component => {
            return {
                inputTitle: capFirstLetter(phraseByArr(component.title)),
                inputSize: "m",

                id: component.id,
                type: "datepicker",
                numberInOrder: component.numberInOrder,
                error: {
                    value: true, message: `Выберите ${getCase(
                        component.title, component.gender, "винительный"
                    )}`
                }
            };
        });

    return (
        <>
            <Form<T>
                successMessage={`Данные о ${getCase(
                    noun, gender, "предложный"
                )} добавлены`}
                successCode={201}
                additionalFormData={
                    [{ managementCompanyId: 1 }]
                }
                urlToPost={uriToAdd}
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title={`Добавление ${getCase(
                    noun, gender, "родительный"
                )}`}
                inputs={inputs}
                selectors={selectors}
                datePickers={datePickers}
            >
            </Form>
            <Table
                title={capFirstLetter(pluralNominative(noun, gender))}
                buttons={[{ type: "download" }, { type: "upload" }, { type: "add", onClick: () => setIsFormOpened(!isFormOpened) }]}
                filters={...item.components
                    .filter(component => component.isFilter)
                    .flatMap(component => {
                        if (component.filterItems) {
                            return component.filterItems?.map(item => {
                                return {
                                    title: item.name ? capFirstLetter(phraseByArr(item.name))
                                        : capFirstLetter(phraseByArr(component.title)),
                                    titleEng: String(component.id),
                                    type: "checkbox",
                                    items: item.items,
                                };
                            });
                        }
                        return [];
                    })}
                rows={{
                    actions: item.tableActions ? item.tableActions : ["editAndSave", "download"],
                    items: item.components.map(component => ({
                        title: capFirstLetter(phraseByArr(component.title)),
                        type: "text",
                        items: [
                            "пер. Соборный",
                            "ул. Малюгина",
                            "пер. Соборный"
                        ]
                    }))
                }}
            />
        </>
    );
};