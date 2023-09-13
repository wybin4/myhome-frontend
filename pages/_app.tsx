import { AppProps } from "next/app";
import "../styles/global.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return <>
        <Head>
            <title>MyHome</title>
        </Head>
        <Component {...pageProps} />
    </>;
}

export default MyApp;