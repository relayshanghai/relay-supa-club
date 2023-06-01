/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import { SearchPageInner } from './search-page';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchProvider } from '../../hooks/use-search';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import { rest } from 'msw';
import { deleteDB } from 'idb';

describe('<SearchPage />', () => {
    before(async () => {
        worker.start();
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
        ).should('not.exist');
        cy.findByTestId('recommended-toggle').click({ force: true });
        cy.contains(
            'Are those which have worked with relay.club brands in the past and are known to be open to cooperation',
        );
        // TODO: reimplement
        // cy.findAllByRole('row').should('have.length', 3);
    });
    it('renders with no results', () => {
        const searchResult = {
            total: 0,
            accounts: [],
        };
        worker.use(rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (_, res, ctx) => res(ctx.json(searchResult))));

        testMount(
            <SearchProvider>
                <SearchPageInner />
            </SearchProvider>,
        );
        cy.contains('Total Results');
        // there is a 5 second wait on the first load until 'no results' is shown
        cy.contains('No results found', { timeout: 6000 });
    });

    it('renders error on search error', async () => {
        await deleteDB('app-cache');
        worker.use(rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (_, res, ctx) => res(ctx.status(500))));

        testMount(<SearchPageInner />);
        cy.contains('Total Results');
        cy.contains('Failed to fetch search results');
    });
});

export {};
