import { FunctionComponent, useContext } from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";
import { Navigation } from "./Navigation/Navigation";
import { AppContext, AppContextProvider, IAppContext } from "@/context/app.context";
import { Form, Select, DatePickerInput, Input } from "@/components";
import cn from 'classnames';

const Layout = ({ children }: LayoutProps): JSX.Element => {
    const { isFormOpened, setIsFormOpened } = useContext(AppContext);
    return (
        <>
            <Form
                isOpened={isFormOpened} setIsOpened={setIsFormOpened}
                title="Добавление счётчика">
                <Select
                    className="mb-4"
                    size="m"
                    inputTitle="Тип услуги" id="typeOfService"
                    options={[
                        { value: "1", text: "Газ" },
                        { value: "2", text: "Электричество" },
                        { value: "3", text: "ХВС" },
                    ]} />
                <DatePickerInput className="mb-4" inputTitle="Дата поверки" inputSize="m" />
                <Input className="mb-4" placeholder="" size="m" title="Предыдущее показание" />
                <DatePickerInput inputTitle="Дата предыдущего показания" inputSize="m" />
            </Form>
            <div className={cn(styles.wrapper, {
                [styles.blurScreen]: isFormOpened
            })}>

                <Header className={styles.header} />
                <Navigation className={styles.navigation} />
                <div className={styles.body}>
                    {children}
                </div>
                <Footer className={styles.footer} />
            </div>
        </>
    );
};

export const withLayout = <T extends Record<string, unknown> & IAppContext>(Component: FunctionComponent<T>) => {
    return function withLayoutComponent(props: T): JSX.Element {
        return (
            <AppContextProvider
                role={props.role}
                isFormOpened={props.isFormOpened}
                setIsFormOpened={props.setIsFormOpened}
            >
                <Layout>
                    <Component {...props} />
                </Layout>
            </AppContextProvider>
        );
    };
};