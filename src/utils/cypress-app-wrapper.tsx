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
import { Provider as JotaiProvider } from 'jotai';
import type { WritableAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { CompanyProvider } from 'src/hooks/use-company';
i18n.changeLanguage('en-US');

export interface TestMountOptions {
    /** The pathname that it will tell the router the app is currently visiting */
    pathname?: string;
    pushStub?: Cypress.Agent<any>;
    query?: Record<string, string>;
    useLocalStorageCache?: boolean;
    jotaiInitialValues?: InitialValues;
}

export type InitialValues = [WritableAtom<unknown, any[], any>, unknown][];

const mockProfile: IUserContext['profile'] = {
    id: '1',
    user_role: 'company_owner',
    company_id: '8e6e65ca-dd79-4e68-90e4-9c5462991ae4',
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

const HydrateAtoms = ({ initialValues, children }: { initialValues: InitialValues; children: React.ReactNode }) => {
    useHydrateAtoms(initialValues);
    return <>{children}</>;
};

export const JotaiTestProvider = ({
    initialValues,
    children,
}: {
    initialValues: InitialValues;
    children: React.ReactNode;
}) => (
    <JotaiProvider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </JotaiProvider>
);

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
    mount(
        // Try to match the order of the real app as much as possible from _app.tsx
        <AppRouterContext.Provider value={router as any}>
            <I18nextProvider i18n={i18n}>
                <SessionContextProvider supabaseClient={supabaseClient} initialSession={{} as any}>
                    {/* gets rid of the localStorage cache in tests */}
                    <SWRConfig value={{ provider: () => new Map() }}>
                        <UserContext.Provider value={mockUserContext}>
                            <JotaiTestProvider initialValues={options?.jotaiInitialValues ?? []}>
                                <CompanyProvider>{component}</CompanyProvider>
                            </JotaiTestProvider>
                        </UserContext.Provider>
                    </SWRConfig>
                </SessionContextProvider>
            </I18nextProvider>
            <Toaster />
        </AppRouterContext.Provider>,
    );
};
