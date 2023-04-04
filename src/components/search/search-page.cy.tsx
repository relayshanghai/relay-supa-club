/// <reference types="@testing-library/cypress" />

import React from 'react';
import { SearchPageInner } from './search-page';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchProvider } from '../../hooks/use-search';
import { worker } from '../../mocks/browser';

describe('<SearchPage />', () => {
    before(async () => {
        worker.start();
    });
    it('renders with no results', () => {
        testMount(<SearchPageInner />);
        cy.contains('Total Results');
        cy.contains('No results found');
    });
    it('renders default landing page results from mocks', () => {
        testMount(
            <SearchProvider>
                <SearchPageInner />
            </SearchProvider>,
        );
        cy.contains('Total Results: 8.43M');
        cy.contains('T-Series');
    });
    it('can filter results by recommended or not. toggle has a hover message like in search-result-row', () => {
        testMount(
            <SearchProvider>
                <SearchPageInner />
            </SearchProvider>,
        );
        cy.contains('Total Results: 8.43M');

        cy.findAllByRole('row').should('have.length', 11);

        cy.contains(
            'Are those which have worked with relay.club brands in the past and are known to be open to cooperation',
        ).should('not.be.visible');
        cy.findByTestId('recommended-toggle').click();
        cy.contains(
            'Are those which have worked with relay.club brands in the past and are known to be open to cooperation',
        );

        cy.findAllByRole('row').should('have.length', 3);
    });
});

export {};
