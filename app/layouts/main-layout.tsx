'use client';

import { useState, type FC, type PropsWithChildren } from 'react';
import { SidebarV2 } from 'app/components/sidebar';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { UserProviderV2 } from 'src/hooks/v2/use-user';
import { Navbar } from 'app/components/navbar';
import { Toaster } from 'react-hot-toast';
import { AnalyticsProviderV2, useDeviceId } from 'app/components/analytics/analytics-provider';
import ChatwootProviderV2 from 'app/components/chatwoot/chatwoot-provider';
import chatwootConfig from 'chatwoot.config';
import { useLocalization } from 'app/components/language-toggle/language-toggle';

type MainLayoutProps = PropsWithChildren & {
    language?: string;
    setLanguage?: (language: string) => void;
};

const MainLayout: FC<MainLayoutProps> = ({ children, language, setLanguage }) => {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient());
    useDeviceId();
    useLocalization();

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            <UserProviderV2>
                <AnalyticsProviderV2>
                    <ChatwootProviderV2 {...chatwootConfig}>
                        <div className="fixed flex h-screen w-screen">
                            <SidebarV2 />
                            <div className="flex w-full max-w-full flex-col overflow-hidden">
                                <Navbar language={language} setLanguage={setLanguage} />
                                <div id="layout-wrapper" className="h-full w-full overflow-auto">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </ChatwootProviderV2>
                </AnalyticsProviderV2>
                <Toaster />
            </UserProviderV2>
        </SessionContextProvider>
    );
};

export default MainLayout;
