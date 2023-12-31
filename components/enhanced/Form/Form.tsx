/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseFormProps, FormElementProps, FormProps, NestedSelectionFormItemProps, SerialFormProps, SelectionDataItem, SelectionFormCheckboxProps, SelectionFormProps, InfoFormProps, CardFormProps, FileFormProps } from "./Form.props";
import styles from "./Form.module.css";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, DatePickerInput, Excel, Icon, Input, InputVote, LittleSelect, Paragraph, PopUp, Select, Textarea, Ul } from "@/components";
import { FieldValues, Controller, useForm } from "react-hook-form";
import ArrowIcon from "./arrow.svg";
import SuccessIcon from "./success.svg";
import FailureIcon from "./failure.svg";
import CloseIcon from "./close.svg";
import { Attachment } from "@/components/primitive/Attachment/Attachment";
import { api } from "@/helpers/api";
import { AxiosError } from "axios";
import { FileType } from "@/components/primitive/Attachment/Attachment.props";
import { capFirstLetter } from "@/helpers/constants";

export const BaseForm = <T extends FieldValues>({
    isOpened, setIsOpened,
    reset,
    setActiveForm, formRef, additionalRef,
    children
}: BaseFormProps<T>) => {
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        if (isOpened) {
            setIsFormVisible(true);
        } else {
            setIsFormVisible(false);
        }
    }, [isOpened]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node | null)) {
                if (additionalRef && additionalRef.current) {
                    return;
                }
                if (reset) {
                    reset();
                }
                setIsOpened && setIsOpened(false);
                if (setActiveForm && isOpened) {
                    setActiveForm();
                }
            }
        };

        if (isFormVisible) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isFormVisible]);

    return (<>{children}</>);
};

export const Form = <T extends FieldValues>({
    title,
    inputs, selectors, datePickers, textAreas, attachments, inputVotes,
    className, useFormData,
    isOpened, setIsOpened,
    urlToPost, additionalFormData,
    successCode, successMessage, setPostData, entityName,
    oneRow = false, dataList, buttonsText,
    ...props
}: FormProps<T>): JSX.Element => {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const formRef = useRef<HTMLDivElement | null>(null);

    const { handleSubmit, control, setError, formState: { errors }, reset } = useFormData;


    const formComponents: FormElementProps<T>[] = [
        ...inputs || [],
        ...selectors || [],
        ...datePickers || [],
        ...textAreas || [],
        ...attachments || [],
        ...inputVotes || []
    ];

    formComponents.sort((a, b) => a.numberInOrder - b.numberInOrder);
    const elementCount = Math.max(...formComponents.map(component => component.numberInOrder));
    const newFormComponents = formComponents.map(component => {
        if (component.type === "datepicker") {
            return component;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { numberInOrder, ...rest } = component;
        return rest;
    });

    type SelectorValue = { value: number | string; text: string };
    const onSubmit = async (formData: T) => {
        setSubmitCount(submitCount + 1);

        try {
            let flatObject: { [key: string]: string | number | SelectorValue };

            if (additionalFormData) {
                flatObject = {
                    ...formData,
                    ...Object.assign({}, additionalFormData),
                };
            } else {
                flatObject = { ...formData };
            }

            for (const key in flatObject) {
                if (typeof flatObject[key] === "object" && "value" in (flatObject as { [key: string]: SelectorValue })[key]) {
                    flatObject[key] = (flatObject as { [key: string]: SelectorValue })[key].value;
                }
            }

            const flatObjectWithData: { [key: string]: string | number | SelectorValue | { [key: string]: string | number | SelectorValue } } = flatObject;
            if (dataList) {
                const dataArr: { [key: string]: string | number | SelectorValue } = {};
                for (const key in flatObject) {
                    if (dataList.includes(key)) {
                        if (key !== "attachment") {
                            dataArr[key] = flatObject[key];
                            delete flatObjectWithData[key];
                        } else {
                            flatObjectWithData["file"] = flatObject[key];
                            delete flatObjectWithData[key];
                        }
                    }
                }
                flatObjectWithData.data = dataArr;
            }

            const response =
                dataList
                    ?
                    await api.post(urlToPost, flatObjectWithData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    })
                    :
                    entityName ?
                        await api.post(urlToPost, {
                            [entityName + "s"]: [flatObject],
                            ...additionalFormData
                        })
                        : await api.post(urlToPost, flatObjectWithData);

            if (response.status === successCode) {
                setIsSuccess(true);
                setFormError("");
                if (setIsOpened) {
                    setIsOpened(false);
                }
                if (setPostData) {
                    setPostData(response.data);
                }
                reset();
            } else {
                setFormError("Что-то пошло не так");
            }
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setFormError(e.response?.data.message);
            } else {
                setFormError("Что-то пошло не так");
            }
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (submitCount) {
            setIsPopupVisible(true);
            timer = setTimeout(() => {
                setIsPopupVisible(false);
                setSubmitCount(0);
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [submitCount]);

    return (
        <>
            {isPopupVisible &&
                <>
                    <PopUp
                        isOpen={isSuccess}
                        setIsOpen={setIsSuccess}
                        type="success" className={styles.popup}>
                        {successMessage}
                    </PopUp>
                    <PopUp
                        isOpen={formError !== ""}
                        setIsOpen={() => setFormError("")}
                        type="failure" className={styles.popup}>
                        {formError}
                    </PopUp>
                </>
            }
            <BaseForm<T>
                isOpened={isOpened} setIsOpened={setIsOpened}
                formRef={formRef}
                reset={reset}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={cn(className, styles.wrapper, {
                        "hidden": !isOpened,
                        [styles.oneRow]: oneRow
                    })} {...props} ref={formRef}>
                        <Paragraph size="l" className={styles.title}>{title}</Paragraph>
                        <div className={cn(styles.content, {
                            "grid grid-cols-2 gap-x-8 min-w-[42.25rem]": elementCount > 4 && !oneRow,
                            "lg:grid-cols-1 lg:min-w-fit": elementCount > 4,
                            "md:grid-cols-1 md:min-w-fit": elementCount > 4,
                            "sm:grid-cols-1 sm:min-w-fit": elementCount > 4,
                        })}>
                            {newFormComponents.map((component, key) => {
                                switch (component.type) {
                                    case "input":
                                        return (
                                            <Controller
                                                key={key}
                                                control={control}
                                                name={component.id}
                                                rules={
                                                    {
                                                        required: {
                                                            value: component.error.value,
                                                            message: component.error.message ? component.error.message : ""
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Input key={key}
                                                        value={field.value}
                                                        setValue={field.onChange}
                                                        ref={field.ref}
                                                        className="mb-4"
                                                        placeholder=""
                                                        size="m"
                                                        inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                        {...component}
                                                    />
                                                )}
                                            />
                                        );
                                    case "input-vote":
                                        return (
                                            <Controller
                                                key={key}
                                                control={control}
                                                name={component.id}
                                                rules={
                                                    {
                                                        required: {
                                                            value: component.error.value,
                                                            message: component.error.message ? component.error.message : ""
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <InputVote
                                                        value={field.value}
                                                        setValue={field.onChange}
                                                        ref={field.ref}
                                                        className="mb-4"
                                                        inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                        {...component} />
                                                )}
                                            />
                                        );
                                    case "datepicker":
                                        return (
                                            <Controller
                                                key={key}
                                                control={control}
                                                name={component.id}
                                                rules={
                                                    {
                                                        required: {
                                                            value: component.error.value,
                                                            message: component.error.message ? component.error.message : ""
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <DatePickerInput
                                                        choosedDate={field.value}
                                                        setChoosedDate={field.onChange}
                                                        ref={field.ref}
                                                        size="m"
                                                        className="mb-4"
                                                        inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                        {...component} />
                                                )}
                                            />
                                        );
                                    case "select":
                                        return (
                                            <Controller
                                                key={key}
                                                control={control}
                                                name={component.id}
                                                rules={
                                                    {
                                                        required: {
                                                            value: component.error.value,
                                                            message: component.error.message ? component.error.message : ""
                                                        }
                                                    }
                                                }
                                                render={({ field }) => {
                                                    return (
                                                        <>
                                                            {
                                                                component.selectorType !== "little" &&
                                                                <Select
                                                                    canIOpen={component.canIOpenFlag &&
                                                                    {
                                                                        foo: () => {
                                                                            if (component.canIOpenFlag) {
                                                                                if (component.canIOpenFlag.flag) {
                                                                                    setError(component.id, {
                                                                                        type: 'manual',
                                                                                        message: component.canIOpenFlag.error,
                                                                                    });
                                                                                } else {
                                                                                    setError(component.id, {
                                                                                        type: 'manual',
                                                                                        message: "",
                                                                                    });
                                                                                }
                                                                            }
                                                                        },
                                                                        flag: component.canIOpenFlag.flag
                                                                    }}
                                                                    setInputError={(newInputError: string) => {
                                                                        setError(component.id, {
                                                                            type: 'manual',
                                                                            message: newInputError,
                                                                        });
                                                                    }}
                                                                    selected={field.value}
                                                                    setSelected={field.onChange}
                                                                    ref={field.ref}
                                                                    className="mb-4"
                                                                    inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                                    handleSelect={component.handleSelect}
                                                                    size="m"
                                                                    {...component} />
                                                            }
                                                            {
                                                                component.selectorType === "little" &&
                                                                <LittleSelect
                                                                    selected={field.value}
                                                                    setSelected={field.onChange}
                                                                    ref={field.ref}
                                                                    className="mb-4"
                                                                    inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                                    {...component} />
                                                            }
                                                        </>
                                                    );
                                                }}
                                            />
                                        );
                                    case "textarea":
                                        return (
                                            <Controller
                                                key={key}
                                                control={control}
                                                name={component.id}
                                                rules={
                                                    {
                                                        required: {
                                                            value: component.error.value,
                                                            message: component.error.message ? component.error.message : ""
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Textarea
                                                        text={field.value}
                                                        setText={field.onChange}
                                                        ref={field.ref}
                                                        className="mb-4"
                                                        textareaError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                        {...component} />
                                                )}
                                            />
                                        );
                                    case "attachment":
                                        return (
                                            <Controller
                                                key={key}
                                                control={control}
                                                name={component.id}
                                                rules={
                                                    {
                                                        required: {
                                                            value: component.error.value,
                                                            message: component.error.message ? component.error.message : ""
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Attachment
                                                        file={field.value}
                                                        handleFile={field.onChange}
                                                        ref={field.ref}
                                                        className="mb-4 mt-6"
                                                        inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                        {...component} />
                                                )}
                                            />
                                        );
                                }
                            })}
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button appearance="ghost" size="m" type="button" onClick={() => {
                                reset();
                                setIsOpened && setIsOpened(!isOpened);
                            }}>{buttonsText ? buttonsText.cancell : "Отмена"}</Button>
                            <Button appearance="primary" size="m">{buttonsText ? buttonsText.add : "Добавить"}</Button>
                        </div>
                    </div>
                </form>
            </BaseForm>
        </>
    );
};

export const CardForm = ({
    title, items,
    isOpened, setIsOpened,
    selected, setSelected,
    next,
    ...props
}: CardFormProps) => {
    const formRef = useRef<HTMLDivElement | null>(null);

    return (
        <>
            <BaseForm
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                formRef={formRef}
            >
                <div ref={formRef} className={cn(styles.wrapper, styles.cardWrapper, {
                    "hidden": !isOpened
                })} {...props}>
                    <div className={styles.cardTopWrapper}>
                        <Paragraph size="l" className={styles.title}>{title}</Paragraph>
                        <div className={styles.littleCardWrapper}>
                            {items.map((item, key) => (
                                <div
                                    onClick={() => setSelected(item.key)}
                                    key={key}
                                    className={cn(styles.littleCard, {
                                        [styles.littleCardSelected]: selected === item.key
                                    })}
                                >
                                    <Icon appearance="primary" size="m" type="icon">{item.icon}</Icon>
                                    <p>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.buttonWrapper}>
                        <Button appearance="ghost" size="m" type="button"
                            onClick={() => {
                                setSelected("");
                                setIsOpened && setIsOpened(!isOpened);
                            }}
                        >Отмена</Button>
                        <Button appearance="primary" size="m" onClick={() => {
                            if (selected != "") {
                                next();
                            }
                        }}>Выбрать</Button>
                    </div>
                </div>
            </BaseForm>
        </>
    );
};

export const SelectionForm = ({
    title, data,
    isOpened, setIsOpened,
    checkedIds, setCheckedIds,
    ...props
}: SelectionFormProps) => {
    const [prevCheckedIds, setPrevCheckedIds] = useState<number[]>([]);
    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (checkedIds) {
            setPrevCheckedIds(checkedIds);
        }
    }, [isOpened]);

    return (
        <>
            <BaseForm
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                formRef={formRef}
            >
                <div ref={formRef} className={cn(styles.wrapper, styles.selectWrapper, {
                    "hidden": !isOpened
                })} {...props}>
                    <div className={styles.topPartWrapper}>
                        <Paragraph size="l" className={styles.title}>{title}</Paragraph>
                        {data.dataType === "flat" && data.items.length !== 0 && (
                            <div className={styles.selectFlatWrapper}>
                                {
                                    data.items.map((item: SelectionDataItem) =>
                                        <SelectionFormCheckbox checkedIds={checkedIds} setCheckedIds={setCheckedIds} item={item} key={item.id} />
                                    )
                                }
                            </div>
                        )}
                        {data.dataType === "nested" && data.items.length !== 0 && (
                            <div>
                                {
                                    data.items.map((item, key) =>
                                        <NestedSelectionFormItem
                                            key={key}
                                            checkedIds={checkedIds}
                                            setCheckedIds={setCheckedIds}
                                            {...item} />
                                    )
                                }
                            </div>
                        )}
                    </div>
                    <div className={styles.buttonWrapper}>
                        <Button appearance="ghost" size="m" type="button"
                            onClick={() => {
                                if (setCheckedIds) {
                                    setCheckedIds(prevCheckedIds);
                                }
                                setIsOpened && setIsOpened(!isOpened);
                            }}
                        >Отмена</Button>
                        <Button appearance="primary" size="m" onClick={() => setIsOpened && setIsOpened(!isOpened)}>Выбрать</Button>
                    </div>
                </div>
            </BaseForm>
        </>
    );
};

const NestedSelectionFormItem = ({ icon, title, checkedIds, setCheckedIds, values, ...props }: NestedSelectionFormItemProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    return (
        <>
            <div className="flex items-center justify-between mb-[0.6rem]" {...props}>
                <div className="flex items-center gap-[0.5625rem]">
                    <span className={styles.selectIcon}>{icon}</span>
                    <p className="text-[0.875rem]">{title}</p>
                </div>
                <span className={cn(styles.selectArrow, {
                    "rotate-180": !isOpen
                })} onClick={() => setIsOpen(!isOpen)}><ArrowIcon /></span>
            </div>
            {isOpen && <div className={cn("mb-[0.6rem]", styles.selectNestedWrapper)}>
                {values.map(value =>
                    <SelectionFormCheckbox checkedIds={checkedIds} setCheckedIds={setCheckedIds} item={value} key={value.id} />
                )
                }
            </div>}
        </>
    );
};

const SelectionFormCheckbox = ({ item, checkedIds, setCheckedIds, ...props }: SelectionFormCheckboxProps) => {
    return (
        <div {...props}>
            <Checkbox
                forString={`select${item.id}`}
                checked={checkedIds?.includes(item.id)}
                onClick={() => checkedIds && setCheckedIds &&
                    setCheckedIds(
                        (prevCheckedIds) => {
                            if (prevCheckedIds.includes(item.id)) {
                                return prevCheckedIds.filter((num) => num !== item.id);
                            } else {
                                return [...prevCheckedIds, item.id];
                            }
                        }
                    )}
                key={item.id}>
                {item.value}
            </Checkbox>
        </div>
    );
};

export const SerialForm = ({
    title, data,
    activeForm, setActiveForm,
    setFormValue, additionalRef,
    number,
    ...props
}: SerialFormProps) => {
    const formRef = useRef<HTMLDivElement | null>(null);

    const { control, setValue, getValues, reset, formState: { errors }, trigger } = useForm({ shouldUnregister: false });

    useEffect(() => {
        if (data.dataType === "pick" && data.value) {
            setValue(data.id, data.value);
        }
    }, [data]);


    return (
        <>
            <BaseForm
                isOpened={activeForm === number}
                setIsOpened={() => setActiveForm(number)}
                formRef={formRef}
                setActiveForm={() => setActiveForm(0)}
                reset={reset}
                additionalRef={additionalRef}
            >
                <div ref={formRef} className={cn(styles.wrapper, styles.selectWrapper, {
                    "hidden": activeForm !== number
                })} {...props}>
                    <div className={styles.topPartWrapper}>
                        <Paragraph size="l" className={styles.title}>{title}</Paragraph>
                        {data.dataType === "scroll" &&
                            <div className={styles.scrollWrapper}>
                                {data.items.map((item, key) =>
                                    <div key={key} className={styles.scrollItem}>
                                        {item.value}
                                        <div className={styles.scrollDescription}>{item.description}</div>
                                    </div>
                                )}
                            </div>
                        }
                        {data.dataType === "pick" &&
                            <div>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: {
                                            value: data.error.value,
                                            message: data.error.message ? data.error.message : ""
                                        }
                                    }}
                                    name={data.id}
                                    render={({ field }) => (
                                        <Input placeholder={data.placeholder ? String(data.placeholder) : ""} size="m"
                                            ref={field.ref}
                                            value={field.value} setValue={field.onChange}
                                            inputType={data.inputType}
                                            inputError={errors[data.id] ? String(errors[data.id]?.message) : ""}
                                        />
                                    )}
                                />
                                {data.value && data.description && <div className={styles.formDesc}>{data.description}</div>}
                            </div>
                        }
                    </div>
                    <div className={styles.buttonWrapper}>
                        <Button appearance="ghost" size="m" type="button"
                            onClick={() => {
                                if (data.dataType === "pick") {
                                    setValue(data.id, "");
                                }
                                setActiveForm(number - 1);
                            }}
                        >Назад</Button>
                        <Button appearance="primary" size="m"
                            onClick={async () => {
                                if (data.dataType === "pick") {
                                    const isValid = await trigger(data.id);
                                    if (isValid) {
                                        setActiveForm(activeForm + 1);
                                        if (setFormValue) {
                                            if (data.inputType === "string") {
                                                setFormValue(getValues(data.id));
                                            } else if (data.inputType === "number") {
                                                setFormValue(parseFloat(getValues(data.id)));
                                            }
                                        }
                                    }
                                }
                                if (data.dataType === "scroll") {
                                    setActiveForm(activeForm + 1);
                                }
                            }}
                        >Далее</Button>
                    </div>
                </div>
            </BaseForm>
        </>
    );
};

export const InfoForm = ({
    title, text, icon, buttons,
    activeForm, setActiveForm, number,
    ...props
}: InfoFormProps) => {
    const formRef = useRef<HTMLDivElement | null>(null);

    return (
        <>
            <BaseForm
                isOpened={activeForm === number}
                setIsOpened={() => setActiveForm(number)}
                formRef={formRef}
                setActiveForm={() => setActiveForm(0)}
            >
                <div ref={formRef} className={cn(styles.wrapper, styles.infoWrapper, {
                    "hidden": activeForm !== number
                })} {...props}>
                    <div className={styles.topPartWrapper}>
                        <span
                            className={styles.close}
                            onClick={() => setActiveForm(0)}
                        ><CloseIcon /></span>
                        {icon &&
                            <Icon size="l" type="icon" className={styles.infoIcon}
                                appearance={icon === "success" ? "green" : "red"}
                            >
                                {icon === "success" && <SuccessIcon />}
                                {icon === "failure" && <FailureIcon />}
                            </Icon>
                        }
                        <Paragraph size="l" className={styles.infoTitle}>{title}</Paragraph>
                        <div className={styles.formText}>{text}</div>
                    </div>
                    <div className={styles.buttonWrapper}>
                        {buttons.map((button, index) => {
                            if (index % 2 === 0) {
                                return <Button
                                    key={index}
                                    appearance="ghost" size="m" type="button"
                                    onClick={button.onClick}
                                >{button.name}</Button>;
                            } else {
                                return <Button
                                    key={index}
                                    appearance="primary" size="m"
                                    onClick={button.onClick}
                                >{button.name}</Button>;
                            }
                        })}
                    </div>
                </div>
            </BaseForm>
        </>
    );
};

export const FileForm = ({
    title, headers, selectors,
    isOpened, setIsOpened,
    urlToPost, successCode, successMessage,
    additionalFormData, setPostData,
    entityName,
    ...props
}: FileFormProps) => {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [table, setTable] = useState<Record<string, any>[]>([]);
    const [clear, setClear] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        setIsPopupVisible(true);

        const timer = setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [formError, isSuccess]);

    const onSubmit = async () => {
        try {
            const formData = table.map((row) => {
                const updatedRow: Record<string, any> = {};
                headers.forEach(({ name, value }) => {
                    updatedRow[name] = row[value.toLowerCase()] ? row[value.toLowerCase()] : row[capFirstLetter(value)];
                });
                if (selectors) {
                    selectors.map(({ id, values }) => {
                        const currVal = values.find(v => v.text === updatedRow[id]);
                        if (currVal) {
                            updatedRow[id] = currVal.value;
                        } else {
                            updatedRow[id] = undefined;
                        }
                    });
                }
                return updatedRow;
            });

            const response = await api.post(urlToPost, {
                [entityName + "s"]: formData,
                ...additionalFormData
            });

            if (response.status === successCode) {
                setIsSuccess(true);
                setFormError("");
                if (setIsOpened) {
                    setIsOpened(false);
                }
                if (setPostData) {
                    setPostData(response.data);
                }
                setClear(true);
            } else {
                setFormError("Что-то пошло не так");
            }
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setFormError(e.response?.data.message);
            } else {
                setFormError("Что-то пошло не так");
            }
        }
    };

    return (
        <>
            {isPopupVisible &&
                <>
                    <PopUp
                        isOpen={isSuccess}
                        setIsOpen={setIsSuccess}
                        type="success" className={styles.popup}>
                        {successMessage}
                    </PopUp>
                    <PopUp
                        isOpen={formError !== ""}
                        setIsOpen={() => setFormError("")}
                        type="failure" className={styles.popup}>
                        {formError}
                    </PopUp>
                </>
            }
            <BaseForm
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                formRef={formRef}
                reset={() => setClear(true)}
            >
                <div ref={formRef} className={cn(styles.wrapper, styles.fileWrapper, {
                    "!hidden": !isOpened,
                })} {...props}>
                    <div className={styles.fileSelectorWrapper}>
                        {(selectors && selectors.length > 0) &&
                            <div className={cn(styles.title)}>
                                <Paragraph size="l" className={styles.title}>Поля из других справочников</Paragraph>
                                {selectors.map((s, j) => {
                                    return <Ul
                                        key={j}
                                        className="text-left pt-2"
                                        title={capFirstLetter(headers.find(h => h.name === s.id)?.value || "")}
                                        li={s.values.map(v => v.text)}
                                    />;
                                })}
                            </div>
                        }
                    </div>
                    <div className={cn(styles.fileFormWrapper, {
                        [styles.withoutAdditional]: !selectors || !selectors.length
                    })}>
                        <Paragraph size="l" className={styles.title}>{title}</Paragraph>
                        <Paragraph size="s" className={styles.description}>
                            Обязательно включите поля {headers.map(h => `"${capFirstLetter(h.value)}"`).join(`, `)}
                        </Paragraph>
                        <Excel
                            clear={clear}
                            setClear={setClear}
                            selectors={selectors}
                            matchHeaders={headers}
                            table={table} setTable={setTable}
                            text="Перетащите или загрузите" fileFormat={[FileType.XLSX, FileType.CSV, FileType.TXT]}
                        />
                        <div className={styles.buttonWrapper}>
                            <Button appearance="ghost" size="m" type="button" onClick={() => {
                                setClear(true);
                                setIsOpened && setIsOpened(!isOpened);
                            }}>Отмена</Button>
                            {table.length > 0 &&
                                <Button
                                    appearance="primary" size="m"
                                    onClick={onSubmit}
                                >
                                    Добавить
                                </Button>}
                        </div>
                    </div>
                </div>
            </BaseForm>
        </>
    );
};