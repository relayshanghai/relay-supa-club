import 'styles/reset.css';
import 'styles/fonts.css';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from 'src/hooks/use-user';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
                />
            </Head>
            <UserProvider>
                <Component {...pageProps} />
            </UserProvider>
            <Toaster />
        </>
    );
}

export default MyApp;
