/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import { SearchPageInner } from './search-page-legacy';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchProvider } from '../../hooks/use-search';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import { rest } from 'msw';

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
        cy.contains('8.43M influencers matching your search and filters found.');
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
        cy.get('[data-testid="filter-gender"]').should('have.value', 'FEMALE');
        cy.get('[data-testid="filter-gender-percent"]').should('have.value', '0.05');

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
        cy.contains('0 influencers matching your search and filters found.', { timeout: 6000 });
    });

    it('renders error on search error', async () => {
        worker.use(rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (_, res, ctx) => res(ctx.status(500))));

        testMount(<SearchPageInner />);
        cy.contains('Total Results');
        cy.contains('Failed to fetch search results');
    });
});

export {};
