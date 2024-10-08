/// <reference types="@testing-library/cypress" />
// @ts-check

import React from 'react';
import { CreatorPage } from './creator-page';

import { testMount } from '../../utils/cypress-app-wrapper';
import { rest } from 'msw';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import StoreProvider from 'src/store/Providers/StoreProvider';

describe('<CreatorPage />', () => {
    before(async () => {
        worker.start();
    });

    it('renders', () => {
        testMount(
            <StoreProvider>
                <CreatorPage creator_id="abc-creator" platform="youtube" />
            </StoreProvider>,
        );
    });
    it('shows loading state, then shows report', () => {
        testMount(
            <StoreProvider>
                <CreatorPage creator_id="abc-creator" platform="youtube" />
            </StoreProvider>,
        );
        cy.contains('Generating influencer Report. Please wait');
        cy.contains('T-Series');
    });
    it('shows retry error message when get a retry error', () => {
        // override the default mocks in mocks/browser.ts
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (req, res, ctx) => {
                return res(ctx.status(500), ctx.json({ error: 'retry_later' }));
            }),
        );
        testMount(
            <StoreProvider>
                <CreatorPage creator_id="abc-creator" platform="youtube" />
            </StoreProvider>,
        );
        cy.contains('We are updating this influencer report. Please try again in 10-15 minutes');
    });
    it('shows error when cannot load report', () => {
        // override the default mocks in mocks/browser.ts
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (req, res, ctx) => {
                return res(ctx.status(400), ctx.json({ error: 'error' }));
            }),
        );
        testMount(
            <StoreProvider>
                <CreatorPage creator_id="abc-creator" platform="youtube" />
            </StoreProvider>,
        );
        cy.contains('Failed to fetch report');
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
