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
        cy.contains(
            'We found 8.43M influencer accounts relevant to your topics or using your keywords in recent videos, that matched your filters',
        );
        cy.contains('T-Series');
    });
    it.skip('can filter results by recommended or not. toggle has a hover message like in search-result-row', () => {
        testMount(
            <SearchProvider>
                <SearchPageInner />
            </SearchProvider>,
        );
        cy.contains(
            'We found 8.43M influencer accounts relevant to your topics or using your keywords in recent videos, that matched your filters',
        );

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
        cy.contains('We found');
        // there is a 5 second wait on the first load until 'no results' is shown
        cy.contains(
            'influencer accounts relevant to your topics or using your keywords in recent videos, that matched your filters',
            { timeout: 6000 },
        );
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
