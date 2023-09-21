import { mount } from 'cypress/react18';
import React, { useState } from 'react';
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
import { RouterContext } from 'next/dist/shared/lib/router-context';

i18n.changeLanguage('en-US');

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
