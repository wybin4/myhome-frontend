import { ReferencePageComponentProps } from "./ReferencePageComponent.props";
// import styles from "./ReferencePageComponent.module.css";
import { FileForm, Form, Table } from "@/components";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import RussianNounsJS from "russian-nouns-js";
import { Gender } from "russian-nouns-js/src/Gender";
import { IReferenceTitle } from "@/interfaces/reference/page.interface";
import { DatePickerFormProps, InputFormProps, SelectorFormProps } from "@/components/enhanced/Form/Form.props";
import { SelectorOption } from "@/components/primitive/Select/Select.props";
import { ExcelHeader } from "@/components/primitive/Excel/Excel.props";
// import cn from 'classnames';

export const ReferencePageComponent = <T extends FieldValues>({
    item,
    uriToAdd, additionalSelectorOptions,
    setPostData, additionalFormData, additionalFileFormData,
    uriToAddMany
    // className, ...props
}: ReferencePageComponentProps<T>): JSX.Element => {
    const useFormData = useForm<T>();
    const [isFormOpened, setIsFormOpened] = useState<boolean>(false);
    const [isFileFormOpened, setIsFileFormOpened] = useState<boolean>(false);

    const rne = new RussianNounsJS.Engine();

    const noun = item.rusName;
    const gender = item.gender;

    const pluralNominative = (
        title: IReferenceTitle[], gender: Gender[keyof Gender]
    ) => {
        return title.map(word => {
            if (word.isChangeable) {
                const pluralized = rne.pluralize({ text: word.word, gender })[0];
                const replaced = replaceLettersInDeclinedWord(pluralized, word.replace);
                return replaced;
            } else return word.word;
        }).join(" ");
    };

    const pluralNominativeWithCase = (
        title: IReferenceTitle[], gender: Gender[keyof Gender], caseName: string
    ) => {
        return title.map(word => {
            if (word.isChangeable) {
                const pluralForm = rne.pluralize({ text: word.word, gender })[0];
                const declined = rne.decline({ text: word.word, gender }, caseName, pluralForm)[0];
                const replaced = replaceLettersInDeclinedWord(declined, word.replace);
                return replaced;
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
                const declinedWord = rne.decline({
                    text: word.word,
                    gender: gender
                }, caseName)[0];
                const replaced = replaceLettersInDeclinedWord(declinedWord, word.replace);
                return replaced;
            } else return word.word;
        }).join(" ");
    };

    const replaceLettersInDeclinedWord = (declinedWord: string, replace?: string[]): string => {
        if (replace && replace.length === 2) {
            const replacedWord = declinedWord
                .split('')
                .map(letter => (letter === replace[0] ? replace[1] : letter))
                .join('');

            return replacedWord;
        }

        return declinedWord;
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
                    id: component.sendId ? component.sendId : component.id,
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
            let selectorOptions: SelectorOption[] = [];
            if (additionalSelectorOptions) {
                const data = additionalSelectorOptions.find(ad => ad.id === component.sendId);
                if (data) {
                    selectorOptions = data.data.map(d => {
                        return {
                            value: d.id,
                            text: String(d.name)
                        };
                    });
                }
            }

            return {
                size: "m",
                inputTitle: capFirstLetter(phraseByArr(component.title)),
                options: [...selectorOptions, ...component.selectorOptions || []],

                id: component.sendId ? component.sendId : component.id,
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

                id: component.sendId ? component.sendId : component.id,
                type: "datepicker",
                numberInOrder: component.numberInOrder,
                error: {
                    value: true, message: `Выберите ${getCase(
                        component.title, component.gender, "винительный"
                    )}`
                }
            };
        });

    const getHeaders = (): ExcelHeader[] => {
        return item.components.map(c => {
            return {
                name: String(c.id),
                value: c.title.map(t => t.word).join(" ")
            };
        });
    };

    return (
        <>
            {uriToAddMany &&
                <FileForm
                    headers={getHeaders()}
                    title={`Добавление ${pluralNominativeWithCase(noun, gender, "родительный")}`}
                    isOpened={isFileFormOpened}
                    setIsOpened={setIsFileFormOpened}
                    urlToPost={uriToAddMany}
                    successCode={201}
                    successMessage={`Данные о ${pluralNominativeWithCase(
                        noun,
                        gender,
                        "предложный"
                    )} добавлены`}
                    entityName={item.entityName ? item.entityName : ""}
                    additionalFormData={additionalFileFormData}
                />
            }
            <Form<T>
                successMessage={`Данные о ${getCase(
                    noun, gender, "предложный"
                )} добавлены`}
                successCode={201}
                urlToPost={uriToAdd}
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title={`Добавление ${getCase(
                    noun, gender, "родительный"
                )}`}
                inputs={inputs}
                selectors={selectors}
                datePickers={datePickers}
                setPostData={setPostData}
                additionalFormData={additionalFormData}
            >
            </Form>
            <Table
                title={capFirstLetter(pluralNominative(noun, gender))}
                buttons={[
                    { type: "download" },
                    { type: "upload", onClick: () => setIsFileFormOpened(!isFileFormOpened) },
                    { type: "add", onClick: () => setIsFormOpened(!isFormOpened) }
                ]}
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
                    actions: item.tableActions,
                    ids: [], // ИСПРАВИТЬ
                    items: item.components.sort((a, b) => a.numberInOrder - b.numberInOrder).map(component => ({
                        title: capFirstLetter(phraseByArr(component.title)),
                        type: "text",
                        items: component.rows
                    })),
                    keyElements: item.keyElements
                }}
            />
        </>
    );
};