/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReferencePageComponentProps } from "./ReferencePageComponent.props";
import styles from "./ReferencePageComponent.module.css";
import { FileForm, Form, Htag, Table } from "@/components";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import RussianNounsJS from "russian-nouns-js";
import { Gender } from "russian-nouns-js/src/Gender";
import { IReferencePageItem, IReferenceTitle } from "@/interfaces/reference/page.interface";
import { DatePickerFormProps, InputFormProps, InputVoteFormProps, SelectorFormProps, TextAreaFormProps } from "@/components/enhanced/Form/Form.props";
import { SelectorOption } from "@/components/primitive/Select/Select.props";
import { ExcelHeader } from "@/components/primitive/Excel/Excel.props";
import NoDataIcon from "./nodata.svg";
import cn from "classnames";
import { TableButtonType } from "@/components/composite/TableButton/TableButton.props";
import { capFirstLetter } from "@/helpers/constants";
import { TableFilterItemProps } from "@/components/composite/TableFilter/TableFilter.props";
import { TableSearchProps } from "@/components/primitive/TableSearch/TableSearch.props";

export const ReferencePageComponent = <T extends FieldValues>({
    item,
    additionalSelectorOptions,
    setPostData, additionalFormData, downloadAllData,
    entityName, uriToAdd, addMany = true,
    handleFilter, handleFilterDate, handleSearch, isData
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

    const getPretext = (
        title: IReferenceTitle[]
    ) => {
        if (title[0]) {
            if (title[0].replace) {
                if (title[0].replace[0] === "о") {
                    return "об";
                }
            }
        }
        return "о";
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

    const getComponent = (component: IReferencePageItem<T>) => {
        return ({
            title: capFirstLetter(phraseByArr(component.title)),
            size: "m",

            id: component.sendId ? component.sendId : component.id,
            type: component.type,
            numberInOrder: component.numberInOrder,
            error: {
                value: true, message: `Выберите ${getCase(
                    component.title, component.gender, "винительный"
                )}`
            }
        });
    };

    const getComponents = (): {
        inputs: InputFormProps<T>[],
        inputVotes: InputVoteFormProps<T>[],
        datePickers: DatePickerFormProps<T>[],
        textAreas: TextAreaFormProps<T>[]
    } => {
        const components = item.components.map(component => getComponent(component));

        const inputs = components.filter(c => c && c.type === "input") as InputFormProps<T>[];
        const datePickers = components.filter(c => c && c.type === "datepicker") as DatePickerFormProps<T>[];
        const inputVotes = components.filter(c => c && c.type === "input-vote") as InputVoteFormProps<T>[];
        const textAreas = components.filter(c => c && c.type === "textarea") as TextAreaFormProps<T>[];

        return { inputs, datePickers, inputVotes, textAreas };
    };

    const getSelectors = (): { selectors: SelectorFormProps<T>[] } => {
        return {
            selectors: item.components
                .filter(c => c.type === "select")
                .map(component => {
                    let selectorOptions: SelectorOption[] = [];
                    if (additionalSelectorOptions) {
                        const data = additionalSelectorOptions.find(ad => {
                            return ad.id === component.sendId;
                        });
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
                        ...getComponent(component),
                        options: [...selectorOptions, ...component.selectorOptions || []],
                        selectorType: component.selectorType
                    } as SelectorFormProps<T>;
                })
        };
    };

    const getFilters = (): { filters: TableFilterItemProps[] } => {
        return {
            filters: item.components
                .filter(c => (c.type === "select" || c.enum || c.id === "createdAt" || c.id === "expiredAt") && !c.isNotFilter)
                .map(component => {
                    const title = capFirstLetter(phraseByArr(component.title));

                    if (additionalSelectorOptions) {
                        const data = additionalSelectorOptions.find(ad => {
                            return ad.id === component.sendId;
                        });
                        if (data) {
                            return {
                                title,
                                titleEng: String(component.sendId),
                                type: "checkbox",
                                items: data.data.map(d => {
                                    return {
                                        value: d.id,
                                        text: String(d.name)
                                    };
                                }),
                                handleClick: handleFilter
                            };
                        }
                    }
                    if (component.enum) {
                        return {
                            title,
                            titleEng: String(component.id),
                            type: "checkbox",
                            items: Object.entries(component.enum).map(val => {
                                return {
                                    value: val[0],
                                    text: String(val[1])
                                };
                            }),
                            handleClick: handleFilter
                        };
                    }
                    if (component.id === "createdAt" || component.id === "expiredAt") {
                        return {
                            title,
                            titleEng: component.id,
                            type: "date",
                            handleDateRangeClick: handleFilterDate,
                            items: []
                        };
                    }
                    return {
                        title: capFirstLetter(phraseByArr(component.title)),
                        titleEng: String(component.id),
                        type: "checkbox",
                    };
                })
        };
    };

    const { selectors } = getSelectors();

    const getHeaders = (): ExcelHeader[] => {
        return item.components.filter(c => c.type !== "none").map(c => {
            return {
                name: String(c.sendId ? c.sendId : c.id),
                value: phraseByArr(c.title)
            };
        });
    };

    const getDownloadHeaders = (): ExcelHeader[] => {
        return item.components.filter(c => c.type !== "none").map(c => {
            return {
                name: String(c.id),
                value: capFirstLetter(phraseByArr(c.title))
            };
        });
    };

    const getButtons = (): TableButtonType[] => {
        if (addMany) {
            return [
                { type: "download", onClick: () => downloadAllData && downloadAllData(getDownloadHeaders()) },
                { type: "upload", onClick: () => setIsFileFormOpened(!isFileFormOpened) },
                { type: "add", onClick: () => setIsFormOpened(!isFormOpened) }
            ];
        } else {
            return [
                { type: "download", onClick: () => downloadAllData && downloadAllData(getDownloadHeaders()) },
                { type: "add", onClick: () => setIsFormOpened(!isFormOpened) }
            ];
        }
    };

    const getSearch = (): { search: TableSearchProps } | undefined => {
        const search = item.components.find(c => c.isSearchable);
        if (search) {
            return {
                search: {
                    title: getCase(search.title, search.gender, "дательный"),
                    id: String(search.sendId ? search.sendId : search.id),
                    handleSearch
                }
            };
        }
        return;
    };

    return (
        <>
            {addMany &&
                <FileForm
                    headers={getHeaders()}
                    title={`Добавление ${pluralNominativeWithCase(noun, gender, "родительный")}`}
                    isOpened={isFileFormOpened}
                    setIsOpened={setIsFileFormOpened}
                    urlToPost={uriToAdd}
                    successCode={201}
                    successMessage={`Данные ${getPretext(noun)} ${pluralNominativeWithCase(
                        noun,
                        gender,
                        "предложный"
                    )} добавлены`}
                    entityName={entityName || ""}
                    setPostData={setPostData}
                    additionalFormData={additionalFormData}
                    selectors={selectors.map(s => {
                        return {
                            values: s.options,
                            id: s.id
                        };
                    })}
                />
            }
            <Form<T>
                successMessage={`Данные ${getPretext(noun)} ${getCase(
                    noun, gender, "предложный"
                )} добавлены`}
                successCode={201}
                urlToPost={uriToAdd}
                useFormData={useFormData}
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title={`Добавление ${getCase(
                    noun, gender, "родительный"
                )}`}
                {...getComponents()}
                selectors={selectors}
                setPostData={setPostData}
                additionalFormData={additionalFormData}
                entityName={entityName}
            >
            </Form>
            <div className={cn(styles.tableWrapper, {
                [styles.noData]: !isData
            })}>
                {!isData &&
                    <span className={styles.noDataIcon}><NoDataIcon /></span>
                }
                <div className={styles.titleWrapper}>
                    {!isData &&
                        <Htag size="h1" className={styles.noDataTitle}>{
                            `Данные ${getPretext(noun)} ${pluralNominativeWithCase(
                                noun, gender, "предложный"
                            )
                            } ещё не добавлены`
                        }</Htag>
                    }
                    <Table
                        title={capFirstLetter(pluralNominative(noun, gender))}
                        buttons={getButtons()}
                        {...getFilters()}
                        {...getSearch()}
                        rows={{
                            actions: item.tableActions,
                            ids: [],
                            items: item.components
                                .filter(i => !i.isInvisibleInTable)
                                .sort((a, b) => a.numberInOrder - b.numberInOrder).map(component => ({
                                    title: capFirstLetter(phraseByArr(component.title)),
                                    type: "text",
                                    items: component.rows,
                                    enum: component.enum
                                })),
                            keyElements: item.keyElements,
                        }}
                        isData={isData}
                    />
                </div>
            </div>
        </>
    );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from "@/components";
import { api } from "@/helpers/api";
import { PAGE_LIMIT } from "@/helpers/constants";
import { IFilter, ISearch } from "@/interfaces/meta.interface";
import { Dispatch, SetStateAction } from "react";

export const getPagination = (
    setItemOffset: Dispatch<SetStateAction<number>>,
    data: any, initialData: any, name: string, uriToGet: string,
    postData: any, setPostData: (newData: any, isNew?: boolean, isGet?: boolean) => void,
    search?: ISearch, filters?: IFilter[]
) => {
    const handlePaginate = async (
        selected: number,
    ) => {
        if (data.totalCount !== data[name].length) {
            const { data } = await api.post(uriToGet, {
                meta: {
                    limit: PAGE_LIMIT,
                    page: selected + 1,
                    search, filters,
                },
                ...postData
            });
            setPostData(data, false, true);
        }
    };

    return (
        <>
            {(data.totalCount !== null && initialData.totalCount !== null) &&
                <Pagination
                    handlePaginate={handlePaginate}
                    setItemOffset={setItemOffset}
                    itemsCount={data.totalCount || 0}
                    itemsPerPage={PAGE_LIMIT}
                />
            }
        </>
    );
};

export const setPostDataForEvent = (
    setData: React.Dispatch<React.SetStateAction<any>>,
    name: string,
    newData: any,
    isNew?: boolean,
    isGet?: boolean
) => {
    const nameWithS = name + "s";
    setData((prevData: { [x: string]: any; totalCount: number; }) => {
        if (!isGet) {
            const updatedProperty = [
                ...prevData[nameWithS],
                newData[name],
            ];

            return {
                ...prevData,
                [nameWithS]: updatedProperty,
                totalCount: prevData.totalCount ? prevData.totalCount + 1 : 1,
            };
        } else {
            const dataCount = newData.events[nameWithS].totalCount;
            const newTotalCount = dataCount !== 0 ? dataCount : null;
            const newProp = newData.events[nameWithS][nameWithS];

            return {
                ...prevData,
                [nameWithS]: isNew ? [...newProp] : [...prevData[nameWithS], ...newProp],
                totalCount: newTotalCount,
            };
        }
    });
};

export const setPostDataForReference = (
    setData: React.Dispatch<React.SetStateAction<any>>,
    name: string,
    newData: any,
    isNew?: boolean,
    isGet?: boolean
) => {
    const nameWithS = name + "s";
    setData((prevData: { [x: string]: any; totalCount: number; }) => {
        if (!isGet) {
            const updatedProperty = [
                ...prevData[nameWithS],
                newData[name],
            ];

            return {
                ...prevData,
                [nameWithS]: updatedProperty,
                totalCount: prevData.totalCount ? prevData.totalCount + 1 : 1,
            };
        } else {
            const dataCount = newData.totalCount;
            const newTotalCount = dataCount !== 0 ? dataCount : null;
            const newProp = newData[nameWithS];

            return {
                ...prevData,
                [nameWithS]: isNew ? [...newProp] : [...prevData[nameWithS], ...newProp],
                totalCount: newTotalCount,
            };
        }
    });
};