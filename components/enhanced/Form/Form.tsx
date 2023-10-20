/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseFormProps, FormElementProps, FormProps, NestedSelectionFormItemProps, SerialFormProps, SelectionDataItem, SelectionFormCheckboxProps, SelectionFormProps, InfoFormProps } from "./Form.props";
import styles from "./Form.module.css";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, DatePickerInput, Icon, Input, Paragraph, PopUp, Select, Textarea } from "@/components";
import { FieldValues, Controller, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import ArrowIcon from "./arrow.svg";
import SuccessIcon from "./success.svg";
import FailureIcon from "./failure.svg";
import CloseIcon from "./close.svg";

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
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isFormVisible]);

    return (<>{children}</>);
};

export const Form = <T extends FieldValues>({
    title,
    inputs, selectors, datePickers, textAreas,
    className, useFormData,
    isOpened, setIsOpened,
    urlToPost, additionalFormData,
    successCode, successMessage,
    ...props
}: FormProps<T>): JSX.Element => {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const formRef = useRef<HTMLDivElement | null>(null);

    const { handleSubmit, control, formState: { errors }, reset } = useFormData;

    const formComponents: FormElementProps<T>[] = [
        ...inputs || [],
        ...selectors || [],
        ...datePickers || [],
        ...textAreas || [],
    ];
    formComponents.sort((a, b) => a.numberInOrder - b.numberInOrder);
    const elementCount = Math.max(...formComponents.map(component => component.numberInOrder));
    const newFormComponents = formComponents.map(component => {
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
                    ...Object.assign({}, ...additionalFormData),
                };
            } else {
                flatObject = { ...formData };
            }

            for (const key in flatObject) {
                if (typeof flatObject[key] === 'object' && 'value' in (flatObject as { [key: string]: SelectorValue })[key]) {
                    flatObject[key] = (flatObject as { [key: string]: SelectorValue })[key].value;
                }
            }

            const response = await axios.post(urlToPost, flatObject);
            if (response.status === successCode) {
                setIsSuccess(true);
                setError("");
                if (setIsOpened) {
                    setIsOpened(false);
                }
                reset();
            } else {
                setError("Что-то пошло не так");
            }
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setError(e.response?.data.message);
            } else {
                setError("Что-то пошло не так");
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
                        isOpen={error !== ""}
                        setIsOpen={() => setError("")}
                        type="failure" className={styles.popup}>
                        {error}
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
                    })} {...props} ref={formRef}>
                        <Paragraph size="l" className={styles.title}>{title}</Paragraph>
                        <div className={cn(styles.content, {
                            "grid grid-cols-2 gap-x-8 min-w-[42.25rem]": elementCount > 3,
                            "lg:grid-cols-1 lg:min-w-fit": elementCount > 3,
                            "md:grid-cols-1 md:min-w-fit": elementCount > 3,
                            "sm:grid-cols-1 sm:min-w-fit": elementCount > 3,
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
                                                        inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                        {...component}
                                                    />
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
                                                        choosedDates={field.value}
                                                        setChoosedDates={field.onChange}
                                                        ref={field.ref}
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
                                                render={({ field }) => (
                                                    <Select
                                                        selected={field.value}
                                                        setSelected={field.onChange}
                                                        ref={field.ref}
                                                        className="mb-4"
                                                        inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                                        {...component} />
                                                )}
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
                                }
                            })}
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button appearance="ghost" size="m" type="button" onClick={() => {
                                reset();
                                setIsOpened && setIsOpened(!isOpened);
                            }}>Отмена</Button>
                            <Button appearance="primary" size="m">Добавить</Button>
                        </div>
                    </div>
                </form>
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