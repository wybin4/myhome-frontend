import { FormElementProps, FormProps } from "./Form.props";
import styles from "./Form.module.css";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Button, DatePickerInput, Input, Paragraph, Select } from "@/components";
import { FieldValues, Controller } from "react-hook-form";

export const Form = <T extends FieldValues>({
    title, inputs, selectors, datePickers,
    className, useFormData,
    isOpened, setIsOpened,
    ...props
}: FormProps<T>): JSX.Element => {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { handleSubmit, register, control, formState: { errors } } = useFormData;

    const formComponents: FormElementProps<T>[] = [
        ...inputs || [],
        ...selectors || [],
        ...datePickers || [],
    ];
    formComponents.sort((a, b) => a.numberInOrder - b.numberInOrder);
    const newFormComponents = formComponents.map(component => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { numberInOrder, ...rest } = component;
        return rest;
    });

    const onSubmit = (data: T) => {
        console.log(data);
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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={cn(className, styles.wrapper, {
                "hidden": !isOpened,
            })} {...props} ref={formRef}>
                <Paragraph size="l" className={styles.title}>{title}</Paragraph>
                <div className={styles.content}>
                    {newFormComponents.map((component, key) => {
                        switch (component.type) {
                            case "input":
                                return (
                                    <Input key={key}
                                        {...register(
                                            component.id,
                                            {
                                                required: {
                                                    value: component.error.value,
                                                    message: component.error.message ? component.error.message : ""
                                                }
                                            }
                                        )}
                                        className="mb-4"
                                        placeholder=""
                                        inputError={errors[component.id] ? String(errors[component.id]?.message) : ""}
                                        {...component}
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
                    <Button appearance="ghost" size="m" onClick={() => setIsOpened && setIsOpened(!isOpened)}>Отмена</Button>
                    <Button appearance="primary" size="m">Добавить</Button>
                </div>
            </div>
        </form>
    );
};