import { mount } from 'cypress/react18';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import type { TestMountOptions } from './user-test-wrapper';
import { UserAndCompanyTestWrapper } from './user-test-wrapper';
import { AnalyticsProvider } from 'src/components/analytics/analytics-provider';

import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import './cypress-mock-router'; // loads window.useRouter
import { enUS } from 'src/constants';

i18n.changeLanguage(enUS);

export interface WindowCypress {
    setMockRouter: (options: TestMountOptions) => void;
    useRouter: () => {
        route: string;
        pathname: string;
        query: Record<string, string>;
        asPath: string;
        push: (path: string) => void;
    };
}

export const TestContextsWrapper = ({
    options,
    children,
}: {
    options?: TestMountOptions;
    children: React.ReactNode;
}) => {
    window.setMockRouter(options ?? {});
    const router = window.useRouter();
    // see: https://on.cypress.io/mounting-react
    const supabaseClient = createBrowserSupabaseClient();
    return (
        <RouterContext.Provider value={router as any}>
            <I18nextProvider i18n={i18n}>
                <SessionContextProvider supabaseClient={supabaseClient}>
                    <AnalyticsProvider>
                        {/* gets rid of the localStorage cache in tests */}
                        <SWRConfig value={{ provider: () => new Map() }}>
                            <UserAndCompanyTestWrapper options={options}>{children}</UserAndCompanyTestWrapper>
                        </SWRConfig>
                    </AnalyticsProvider>
                </SessionContextProvider>
            </I18nextProvider>
            <Toaster />
        </RouterContext.Provider>
    );
};

export const testMount = (component: React.ReactElement, options?: TestMountOptions) => {
    mount(<TestContextsWrapper options={options}>{component}</TestContextsWrapper>);
};
