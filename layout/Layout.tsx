import { FunctionComponent, useContext } from "react";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";
import { Navigation } from "./Navigation/Navigation";
import { AppContext, AppContextProvider, IAppContext } from "@/context/app.context";
import { Button } from "@/components";
import cn from 'classnames';

const Layout = ({ children }: LayoutProps): JSX.Element => {
    const { isFormOpened, setIsFormOpened } = useContext(AppContext);
    return (
        <div className={cn(styles.wrapper, {
            // [styles.blurScreen]: isFormOpened
        })}>
            <Header className={styles.header} />
            <Navigation className={styles.navigation} />
            <Button appearance="primary" size="m" onClick={() => setIsFormOpened(!isFormOpened)}>Открыть форму</Button>
            <div className={styles.body}>
                {children}
            </div>
            <Footer className={styles.footer} />
        </div>
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