/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormElementProps, FormProps } from "./Form.props";
import styles from "./Form.module.css";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Button, DatePickerInput, Input, Paragraph, PopUp, Select } from "@/components";
import { FieldValues, Controller } from "react-hook-form";
import axios, { AxiosError } from "axios";

export const Form = <T extends FieldValues>({
    title,
    inputs, selectors, datePickers,
    className, useFormData,
    isOpened, setIsOpened,
    urlToPost, additionalFormData,
    successCode, successMessage,
    ...props
}: FormProps<T>): JSX.Element => {
    const formRef = useRef<HTMLDivElement | null>(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);

    const { handleSubmit, control, formState: { errors }, reset } = useFormData;

    const formComponents: FormElementProps<T>[] = [
        ...inputs || [],
        ...selectors || [],
        ...datePickers || [],
    ];
    formComponents.sort((a, b) => a.numberInOrder - b.numberInOrder);
    const elementCount = Math.max(...formComponents.map(component => component.numberInOrder));
    const newFormComponents = formComponents.map(component => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { numberInOrder, ...rest } = component;
        return rest;
    });

    const onSubmit = async (formData: T) => {
        setSubmitCount(submitCount + 1);

        try {

            let flatObject;
            if (additionalFormData) {
                flatObject = {
                    ...formData,
                    ...Object.assign({}, ...additionalFormData),
                };
            } else {
                flatObject = { ...formData };
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
        if (isOpened) {
            setIsFormVisible(true);
        } else {
            setIsFormVisible(false);
        }
    }, [isOpened]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node | null)) {
                setIsOpened && setIsOpened(false);
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
                    {isSuccess && <PopUp type="success" className={styles.popup}>{successMessage}</PopUp>}
                    {error !== "" && <PopUp type="failure" className={styles.popup}>{error}</PopUp>}
                </>
            }
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
        </>
    );
};