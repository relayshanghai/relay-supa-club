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
import ChatwootProvider from 'src/components/chatwoot/chatwoot-provider';
import chatwootConfig from 'chatwoot.config';
import { useTranslation } from 'react-i18next';
import { AnalyticsProvider } from 'src/components/analytics/analytics-provider';
import Script from 'next/script';

function MyApp({
    Component,
    pageProps,
}: AppProps<{
    initialSession: Session;
}>) {
    const [lang, setLang] = useState(i18n.language);

    useEffect(() => {
        rudderInitialized();
    }, []); //enable rudderstack Analytics

    const [supabaseClient] = useState(() => createBrowserSupabaseClient());
    const { i18n: _i18n } = useTranslation();

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        storedLanguage !== null ? i18n.changeLanguage(storedLanguage) : i18n.changeLanguage(); // triggers the language detector
        // eslint-disable-next-line no-console
        console.log('storedLanguage set to: ', storedLanguage);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const setLang = urlParams.get('set_lang');
            if (typeof setLang === 'string') {
                if (setLang.includes('en')) {
                    i18n.changeLanguage('en-US');
                    localStorage.setItem('language', 'en-US');
                } else if (setLang.includes('zh')) {
                    i18n.changeLanguage('zh-CN');
                    localStorage.setItem('language', 'zh-CN');
                }
            }
        }
    }, []);

    useEffect(() => {
        _i18n.on('languageChanged', (l) => {
            setLang(l);
            // eslint-disable-next-line no-console
            console.log('lang set to: ', l);
        });

        return () => _i18n.on('languageChanged', () => null);
    }, [_i18n]);
    const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

    if (!GOOGLE_ANALYTICS_ID) {
        throw new Error('Google Analytics keys not set');
    }

    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?${new URLSearchParams({
                    id: GOOGLE_ANALYTICS_ID,
                })}`}
            />

            <Script strategy="lazyOnload" id="google-tag-script">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GOOGLE_ANALYTICS_ID}', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="title" content="boostbot.ai: A complete influencer management software solution" />
                <meta
                    name="description"
                    content="Looking for a complete solution to manage influencer marketing for your brand? Our platform has millions of influencers &amp; assists in payments, analytics &amp; more!"
                />
                <meta property="og:title" content="boostbot.ai: A complete influencer management software solution" />
                <meta
                    property="og:description"
                    content="Looking for a complete solution to manage influencer marketing for your brand? Our platform has millions of influencers &amp; assists in payments, analytics &amp; more!"
                />
                <meta property="og:url" content="https://boostbot.ai/" />
                <meta property="og:site_name" content="boostbot.ai: Influencer Management Software" />
                <meta name="twitter:title" content="boostbot.ai: A complete influencer management software solution" />
                <meta
                    name="twitter:description"
                    content="Looking for a complete solution to manage influencer marketing for your brand? Our platform has millions of influencers &amp; assists in payments, analytics &amp; more!"
                />
            </Head>

            <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
                <AnalyticsProvider>
                    <CacheProvider>
                        <JotaiProvider>
                            <UserProvider>
                                <div className="divAboveChatwoot" id={lang}>
                                    <ChatwootProvider {...chatwootConfig} locale={lang}>
                                        <CompanyProvider>
                                            <Component {...pageProps} />
                                        </CompanyProvider>
                                    </ChatwootProvider>
                                </div>
                            </UserProvider>
                        </JotaiProvider>
                    </CacheProvider>
                </AnalyticsProvider>
            </SessionContextProvider>
            <Toaster />
        </>
    );
}

export default MyApp;
