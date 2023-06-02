import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from 'src/hooks/use-user';
import i18n from '../i18n';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { CompanyProvider } from 'src/hooks/use-company';
import { rudderInitialized } from 'src/utils/rudder-initialize';
import { CacheProvider } from 'src/utils/indexeddb-cache-provider';
import { Provider as JotaiProvider } from 'jotai';

function MyApp({
    Component,
    pageProps,
}: AppProps<{
    initialSession: Session;
}>) {
    useEffect(() => {
        rudderInitialized();
    }, []); //enable rudderstack Analytics

    const [supabaseClient] = useState(() => createBrowserSupabaseClient());

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        storedLanguage !== null ? i18n.changeLanguage(storedLanguage) : i18n.changeLanguage(); // triggers the language detector
    }, []);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="title" content="relay.club: A complete influencer management software solution" />
                <meta
                    name="description"
                    content="Looking for a complete solution to manage influencer marketing for your brand? Our platform has millions of influencers &amp; assists in payments, analytics &amp; more!"
                />
                <meta property="og:title" content="relay.club: A complete influencer management software solution" />
                <meta
                    property="og:description"
                    content="Looking for a complete solution to manage influencer marketing for your brand? Our platform has millions of influencers &amp; assists in payments, analytics &amp; more!"
                />
                <meta property="og:url" content="https://relay.club/" />
                <meta property="og:site_name" content="relay.club: Influencer Management Software" />
                <meta name="twitter:title" content="relay.club: A complete influencer management software solution" />
                <meta
                    name="twitter:description"
                    content="Looking for a complete solution to manage influencer marketing for your brand? Our platform has millions of influencers &amp; assists in payments, analytics &amp; more!"
                />
            </Head>

            <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
                <CacheProvider>
                    <UserProvider>
                        <JotaiProvider>
                            <CompanyProvider>
                                <Component {...pageProps} />
                            </CompanyProvider>
                        </JotaiProvider>
                    </UserProvider>
                </CacheProvider>
            </SessionContextProvider>
            <Toaster />
        </>
    );
}

export default MyApp;
