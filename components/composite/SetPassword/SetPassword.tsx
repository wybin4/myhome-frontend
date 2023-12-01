import { SetPasswordProps } from "./SetPassword.props";
import FingerprintIcon from "./fingerprint.svg";
import styles from "./SetPassword.module.css";
import { Button, Htag, Input, Paragraph, PopUp } from "@/components";
import { Controller, Path, Validate, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { API } from "@/helpers/api";
import { UserRole } from "@/interfaces/account/user.interface";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

interface ISetPassword {
    password: string;
    repeatPassword: string;
}

export const SetPassword = ({
    ...props
}: SetPasswordProps): JSX.Element => {
    const { handleSubmit, control, formState: { errors }, getValues } = useForm<ISetPassword>();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        setIsPopupVisible(true);

        const timer = setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [isPopupVisible]);

    const getControlComponent = (
        id: Path<ISetPassword>,
        title: string,
        error: string,
        validate?: Validate<string, ISetPassword> | Record<string, Validate<string, ISetPassword>>
    ) => {
        return (<Controller
            control={control}
            name={id}
            rules={
                {
                    required: {
                        value: true,
                        message: error
                    },
                    validate,
                    minLength: {
                        value: 8,
                        message: "Пароль слишком короткий"
                    }
                }
            }
            render={({ field }) => (
                <Input
                    value={field.value}
                    setValue={field.onChange}
                    ref={field.ref}
                    placeholder=""
                    size="m"
                    className={styles.input}
                    inputType="password"
                    title={title}
                    inputError={errors[id] ? String(errors[id]?.message) : ""}
                />
            )}
        />);
    };

    const onSubmit = async (formData: ISetPassword) => {
        try {
            const { role, id } = router.query;
            const newFormData = { userRole: role, link: id, password: formData.password };
            const response = await axios.post<{ id: number; userRole: UserRole }>(
                API.auth.setPassword, newFormData, {
                withCredentials: true
            }
            );
            if (response.status === 200) {
                setError("");
                router.push("/login");
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

    return (
        <div className={styles.wrapper} {...props}>
            {isPopupVisible &&
                <PopUp
                    isOpen={error !== ""}
                    setIsOpen={() => setError("")}
                    type="failure" className={styles.popup}>
                    {error}
                </PopUp>
            }
            <div className={styles.top}>
                <div className={styles.fgpIcon}><FingerprintIcon /></div>
                <Htag size="h1" className="font-semibold">Создание пароля</Htag>
                <Paragraph size="m" className={styles.description}>Используйте пароль для входа в систему</Paragraph>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.form}
            >
                {getControlComponent("password", "Пароль", "Введите пароль")}
                {getControlComponent(
                    "repeatPassword", "Повторить пароль", "Повторите пароль",
                    (value) => {
                        const { password } = getValues();
                        return password === value || "Пароли должны совпадать";
                    }
                )}
                <Button appearance="primary" size="l">Создать</Button>
            </form>
        </div>
    );
};