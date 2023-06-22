import { mount } from 'cypress/react18';
import React from 'react';
import * as NextRouter from 'next/router';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import type { TestMountOptions } from './user-test-wrapper';
import { UserAndCompanyTestWrapper } from './user-test-wrapper';

i18n.changeLanguage('en-US');

export const TestContextsWrapper = ({
    options,
    children,
}: {
    options?: TestMountOptions;
    children: React.ReactNode;
}) => {
    const push = options?.pushStub ?? cy?.stub();
    const router = cy?.stub(NextRouter, 'default');
    cy?.stub(NextRouter, 'useRouter').returns({
        pathname: options?.pathname ?? '/dashboard',
        push,
        query: options?.query ?? {},
    });
    // see: https://on.cypress.io/mounting-react
    const supabaseClient = createBrowserSupabaseClient();
    return (
        <AppRouterContext.Provider value={router as any}>
            <I18nextProvider i18n={i18n}>
                <SessionContextProvider supabaseClient={supabaseClient} initialSession={{} as any}>
                    {/* gets rid of the localStorage cache in tests */}
                    <SWRConfig value={{ provider: () => new Map() }}>
                        <UserAndCompanyTestWrapper>{children}</UserAndCompanyTestWrapper>
                    </SWRConfig>
                </SessionContextProvider>
            </I18nextProvider>
            <Toaster />
        </AppRouterContext.Provider>
    );
};

export const testMount = (component: React.ReactElement, options?: TestMountOptions) => {
    mount(<TestContextsWrapper options={options}>{component}</TestContextsWrapper>);
};
