import { mount } from 'cypress/react18';
import React from 'react';
import * as NextRouter from 'next/router';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { UserContext } from 'src/hooks/use-user';
import type { IUserContext } from 'src/hooks/use-user';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { RudderStackProvider } from 'src/hooks/use-rudderstack';
i18n.changeLanguage('en');

export interface TestMountOptions {
    /** The pathname that it will tell the router the app is currently visiting */
    pathname?: string;
    pushStub?: Cypress.Agent<any>;
    query?: Record<string, string>;
    useLocalStorageCache?: boolean;
}
const mockProfile: IUserContext['profile'] = {
    id: '1',
    user_role: 'company_owner',
    company_id: '1',
    avatar_url: null,
    email: 'mock@example.com',
    first_name: 'mock-first',
    last_name: 'mock-last',
    phone: null,
    updated_at: '2021-09-01T00:00:00.000Z',
    created_at: '2021-09-01T00:00:00.000Z',
};

const mockUserContext: IUserContext = {
    user: null,
    profile: mockProfile,
    loading: false,
    login: async () => ({
        user: null,
        session: null,
    }),
    createEmployee: async () => null,
    logout: () => null,
    signup: async () => ({
        user: null,
        session: null,
    }),
    updateProfile: () => null,
    refreshProfile: () => null,
    supabaseClient: null,
    getProfileController: { current: null },
};

export const testMount = (component: React.ReactElement, options?: TestMountOptions) => {
    const push = options?.pushStub ?? cy.stub();
    const router = cy.stub(NextRouter, 'default');
    cy.stub(NextRouter, 'useRouter').returns({
        pathname: options?.pathname ?? '/dashboard',
        push,
        query: options?.query ?? {},
    });
    // see: https://on.cypress.io/mounting-react
    const supabaseClient = createBrowserSupabaseClient();
    //@ts-expect-error
    import('preline');
    mount(
        <AppRouterContext.Provider value={router as any}>
            <SessionContextProvider supabaseClient={supabaseClient} initialSession={{} as any}>
                <I18nextProvider i18n={i18n}>
                    <UserContext.Provider value={mockUserContext}>
                        <RudderStackProvider>
                            {/* gets rid of the localStorage cache in tests */}
                            <SWRConfig value={{ provider: () => new Map() }}>{component}</SWRConfig>
                        </RudderStackProvider>
                    </UserContext.Provider>
                </I18nextProvider>
            </SessionContextProvider>
            <Toaster />
        </AppRouterContext.Provider>,
    );
};
