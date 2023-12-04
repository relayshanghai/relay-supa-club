/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import { SearchPageInner } from './search-page-legacy';
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
    it('can filter results and clear filters', () => {
        testMount(
            <SearchProvider>
                <SearchPageInner />
            </SearchProvider>,
        );
        cy.findAllByTestId('filters-button').click();
        cy.contains('Filters');
        cy.contains('Audience Filters');
        cy.contains('Influencer Filters');
        cy.findAllByTestId('has-email-toggle').check({ force: true });
        cy.get('[data-testid="filter-gender"]').select('Male');
        cy.get('[data-testid="filter-gender-percent"]').select('>50%');

        cy.get('[data-testid="filter-lowerage"]').select('45');
        cy.get('[data-testid="filter-upperage"]').select('64');
        cy.get('[data-testid="filter-age-percent"]').select('>30%');

        cy.findAllByTestId('search-with-filters').click();

        cy.findAllByTestId('filters-button').click();
        cy.findAllByTestId('clear-filters').click();
        cy.get('[data-testid="filter-gender"]').should('have.value', 'ANY');
        cy.get('[data-testid="filter-gender-percent"]').should('be.disabled');

        // cy.findAllByRole('row').should('have.length', 11);
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
