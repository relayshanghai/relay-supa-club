/// <reference types="@testing-library/cypress" />
import { testMount } from '../../utils/cypress-app-wrapper';
import { clientRoleAtom } from '../../atoms/clientRoleAtom';
import { worker } from '../../mocks/browser';
import { useHydrateAtoms } from 'jotai/utils';
import AdminSearch from '../../../pages/admin/search/[id]';
import { Provider } from 'jotai';
import React from 'react';

const HydrateAtoms = ({ initialValues, children }: { initialValues: any; children: any }) => {
    useHydrateAtoms(initialValues);
    return children;
};

const TestProvider = ({ initialValues, children }: { initialValues: any; children: any }) => (
    <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
);

describe('<AdminSearch />', () => {
    before(async () => {
        worker.start();
    });

    it('renders admin search panel', () => {
        testMount(<AdminSearch />);
    });

    it('Takes company name from Atom and render it', () => {
        testMount(
            <TestProvider
                initialValues={[
                    [
                        clientRoleAtom,
                        {
                            company_name: 'Test Company Name',
                            company_id: '124125151512',
                        },
                    ],
                ]}
            >
                <AdminSearch />
            </TestProvider>,
        );

        cy.contains('Test Company Name');
    });

    it('Takes another company name from Atom and render it', () => {
        testMount(
            <TestProvider
                initialValues={[
                    [
                        clientRoleAtom,
                        {
                            company_name: 'Test Company Name 2',
                            company_id: '239203592',
                        },
                    ],
                ]}
            >
                <AdminSearch />
            </TestProvider>,
        );

        cy.contains('Test Company Name 2');
    });
});
