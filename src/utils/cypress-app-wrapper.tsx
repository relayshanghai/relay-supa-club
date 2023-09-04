import { mount } from 'cypress/react18';
import React from 'react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import type { TestMountOptions } from './user-test-wrapper';
import { UserAndCompanyTestWrapper } from './user-test-wrapper';
import { AnalyticsProvider } from 'src/components/analytics/analytics-provider';
import './cypress-mock-router';

i18n.changeLanguage('en-US');

export const TestContextsWrapper = ({
    options,
    children,
}: {
    options?: TestMountOptions;
    children: React.ReactNode;
}) => {
    const router = window.setMockRouter(options ?? {});

    // see: https://on.cypress.io/mounting-react
    const supabaseClient = createBrowserSupabaseClient();
    return (
        <AppRouterContext.Provider value={router as any}>
            <I18nextProvider i18n={i18n}>
                <AnalyticsProvider>
                    <SessionContextProvider supabaseClient={supabaseClient} initialSession={{} as any}>
                        {/* gets rid of the localStorage cache in tests */}
                        <SWRConfig value={{ provider: () => new Map() }}>
                            <UserAndCompanyTestWrapper options={options}>{children}</UserAndCompanyTestWrapper>
                        </SWRConfig>
                    </SessionContextProvider>
                </AnalyticsProvider>
            </I18nextProvider>
            <Toaster />
        </AppRouterContext.Provider>
    );
};

export const testMount = (component: React.ReactElement, options?: TestMountOptions) => {
    mount(<TestContextsWrapper options={options}>{component}</TestContextsWrapper>);
};
