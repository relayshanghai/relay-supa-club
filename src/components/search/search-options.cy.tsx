/// <reference types="@testing-library/cypress" />
// @ts-check
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { worker } from '../../mocks/browser';
import type { InitialValues } from '../../utils/cypress-app-wrapper';
import { TestProvider, testMount } from '../../utils/cypress-app-wrapper';
import { SearchPage } from './search-page';

const initialValues: InitialValues = [
    [
        clientRoleAtom,
        {
            companyName: 'Test Company Name',
            companyId: 'ad942d94-41bb-441a-a4e6-66169854b865',
        },
    ],
];

describe('SearchOptions', () => {
    before(() => {
        worker.start();
    });

    it('Shows search button', () => {
        testMount(
            <TestProvider initialValues={initialValues}>
                <SearchPage />
            </TestProvider>,
        );

        cy.contains('Search');
    });

    it('should be empty when we remove topic tags', () => {
        testMount(
            <TestProvider initialValues={initialValues}>
                <SearchPage />
            </TestProvider>,
        );

        cy.findByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
            cy.get('#tag-search-result-alligators').should('exist').click();

            cy.get('input').type('yomrwhite');
            cy.get('#tag-search-result-yomrwhite').should('exist').click();
        });

        cy.get('#remove-tag-alligators').should('exist').click();
        cy.get('#remove-tag-yomrwhite').should('exist').click();

        cy.findByTestId('search-topics').within(() => {
            cy.get('input').should('be.empty');
        });
    });

    it('Should remove and edit the topic tags when pressing backspace', () => {
        testMount(
            <TestProvider initialValues={initialValues}>
                <SearchPage />
            </TestProvider>,
        );

        cy.findByTestId('search-topics').within(() => {
            cy.get('input').type('alligators');
            cy.get('#tag-search-result-alligators').should('exist').click();

            cy.get('input').type('yomrwhite');
            cy.get('#tag-search-result-yomrwhite').should('exist').click();

            cy.get('input')
                .type('{backspace}{backspace}{backspace}{backspace}{backspace}')
                .should('have.value', 'yomrw');
        });
    });
});
