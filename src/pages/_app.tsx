import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

import configureStore from '../store/configureStore';

export default function App({ Component, pageProps }: AppProps) {
    const store = configureStore();
    return (
        <Provider store={store}>
            <Head>
                <link rel="apple-touch-icon" sizes="76x76" href="/img/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
                <link rel="shortcut icon" href="/img/favicon.ico" />
                <meta name="theme-color" content="#000000" />
            </Head>
            <Component {...pageProps} />
        </Provider>
    );
}
