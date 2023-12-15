import { LoginItemProps, LoginProps } from "./Login.props";
import cn from "classnames";
import styles from "./Login.module.css";
import AdminIcon from "./admin.svg";
import OwnerIcon from "./owner.svg";
import MCIcon from "./mc.svg";
import LogoIcon from "./logo.svg";
import LoginIcon from "./login.svg";
import LogoWrapperIcon from "./logowrapper.svg";
import LogoBigWrapperIcon from "./logoBigWrapper.svg";
import { Button, Htag, Input, Paragraph, PopUp } from "@/components";
import { ILoginUser, UserRole } from "@/interfaces/account/user.interface";
import { useEffect, useState } from "react";
import { Controller, Path, useForm } from "react-hook-form";
import { API } from "@/helpers/api";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

export const Login = ({
    ...props
}: LoginProps): JSX.Element => {
    const [error, setError] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.None);
    const [isForm, setIsForm] = useState<boolean>(false);
    const { handleSubmit, control, formState: { errors } } = useForm<ILoginUser>();
    const router = useRouter();

    useEffect(() => {
        setIsPopupVisible(true);

        const timer = setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [isPopupVisible]);


    const htag = (className?: string): JSX.Element => {
        return (
            <div className={cn(styles.htag, className)}>
                <div className={styles.logo}>
                    <LogoIcon />
                </div>
                <Htag size="h1">Выбери роль</Htag>
            </div>
        );
    };

    const handleClick = (userRole: UserRole) => {
        setSelectedRole(userRole);
        setIsForm(true);
    };

    const getName = () => {
        switch (selectedRole) {
            case UserRole.Admin:
                return "администратора";
            case UserRole.ManagementCompany:
                return "управляющей компании";
            case UserRole.Owner:
                return "владельца";
        }
    };

    const onSubmit = async (formData: ILoginUser) => {
        try {
            const flatObject = {
                ...formData,
                userRole: selectedRole
            };
            const response = await axios.post<{ id: number; userRole: UserRole }>(
                API.auth.login, flatObject, {
                withCredentials: true
            }
            );
            if (response.status === 200) {
                setError("");
                router.push("/");
                // reset();
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

    const getControlComponent = (
        id: Path<ILoginUser>,
        title: string,
        error: string
    ) => {
        return (<Controller
            control={control}
            name={id}
            rules={
                {
                    required: {
                        value: true,
                        message: error
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
                    inputType={id === "password" ? "password" : "string"}
                    title={title}
                    inputError={errors[id] ? String(errors[id]?.message) : ""}
                />
            )}
        />);
    };

    return (
        <div {...props}>
            {isPopupVisible &&
                <>
                    {/* <PopUp
                        isOpen={isSuccess}
                        setIsOpen={setIsSuccess}
                        type="success" className={styles.popup}>
                    </PopUp> */}
                    <PopUp
                        isOpen={error !== ""}
                        setIsOpen={() => setError("")}
                        type="failure" className={styles.popup}>
                        {error}
                    </PopUp>
                </>
            }
            {selectedRole === UserRole.None &&
                <>
                    {htag()}
                    {htag(styles.ownerLogoIcon)}
                    {htag(styles.mcLogoIcon)}
                    <div className={styles.wrapper}>
                        <LoginItem title="Администратор"
                            picture={<AdminIcon />}
                            className={styles.admin}
                            handelClick={handleClick}
                            role={UserRole.Admin}
                        />
                        <LoginItem title="Владелец"
                            picture={<OwnerIcon />}
                            className={styles.owner}
                            handelClick={handleClick}
                            role={UserRole.Owner}
                        />
                        <LoginItem title="Управляющая компания"
                            picture={<MCIcon />}
                            className={styles.mc}
                            handelClick={handleClick}
                            role={UserRole.ManagementCompany}
                        />
                    </div>
                </>
            }
            {isForm &&
                <>
                    <span>
                        <span className={styles.logoBigWrapperIcon}> <LogoBigWrapperIcon /></span>
                        <span className={styles.logoWrapperIcon}>
                            <LogoWrapperIcon />
                            <span className={styles.formLogo}>
                                <LogoIcon />
                            </span>
                        </span>
                    </span>
                    <div className={styles.logoFormPageWrapper}>
                        <div className={styles.leftWrapper}>
                            <Htag size="h1" className={styles.welcomeHtag}>Добро пожаловать!</Htag>
                            <Paragraph size="l" className={styles.par}>Вход в личный кабинет <span className={styles.markedPar}>{getName()}</span>
                            </Paragraph>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className={styles.formWrapper}
                            >
                                {getControlComponent("email", "Email", "Введите email")}
                                {getControlComponent("password", "Пароль", "Введите пароль")}
                                <Button appearance="primary" size="m" className={styles.button}>Войти</Button>
                            </form>
                        </div>
                        <div className={styles.loginIcon}>
                            <span><LoginIcon /></span>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

const LoginItem = ({
    picture, title,
    className, handelClick, role, ...props
}: LoginItemProps) => {
    return (
        <div className={cn(styles.itemWrapper, className)} {...props}>
            <div className={styles.pic}>
                {picture}
            </div>
            <div className={styles.titlePicker}>{title}</div>
            <Button className={styles.button}
                appearance="primary"
                size="m"
                onClick={() => handelClick(role)}
            >Войти</Button>
        </div>
    );
};