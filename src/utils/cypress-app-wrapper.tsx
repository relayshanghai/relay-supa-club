import { mount } from 'cypress/react18';
import React from 'react';
import * as NextRouter from 'next/router';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { UserContext } from 'src/hooks/use-user';
import type { IUserContext } from 'src/hooks/use-user';
i18n.changeLanguage('en');

export interface TestMountOptions {
    /** The pathname that it will tell the router the app is currently visiting */
    pathname?: string;
    pushStub?: Cypress.Agent<any>;
}
const mockUserContext: IUserContext = {
    user: null,
    profile: {
        id: '1',
        role: 'company_owner',
        company_id: '1',
        avatar_url: null,
        email: 'mock@example.com',
        first_name: 'mock-first',
        last_name: 'mock-last',
        phone: null,
        updated_at: '2021-09-01T00:00:00.000Z',
        created_at: '2021-09-01T00:00:00.000Z',
    },
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
    cy.stub(NextRouter, 'useRouter').returns({ pathname: options?.pathname ?? '/dashboard', push });
    // see: https://on.cypress.io/mounting-react
    mount(
        <AppRouterContext.Provider value={router as any}>
            <I18nextProvider i18n={i18n}>
                <UserContext.Provider value={mockUserContext}>{component}</UserContext.Provider>
            </I18nextProvider>
        </AppRouterContext.Provider>,
    );
};
