import { mount } from 'cypress/react18';
import React from 'react';
import * as NextRouter from 'next/router';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';

i18n.changeLanguage('en');

export interface TestMountOptions {
    /** The pathname that it will tell the router the app is currently visiting */
    pathname?: string;
    pushStub?: Cypress.Agent<any>;
}

export const testMount = (component: React.ReactElement, options?: TestMountOptions) => {
    const push = options?.pushStub ?? cy.stub();
    const router = cy.stub(NextRouter, 'default');
    cy.stub(NextRouter, 'useRouter').returns({ pathname: options?.pathname ?? '/dashboard', push });
    // see: https://on.cypress.io/mounting-react
    mount(
        <AppRouterContext.Provider value={router as any}>
            <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
        </AppRouterContext.Provider>,
    );
};
