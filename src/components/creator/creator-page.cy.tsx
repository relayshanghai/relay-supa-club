/// <reference types="@testing-library/cypress" />
// @ts-check

import React from 'react';
import { CreatorPage } from './creator-page';

import { testMount } from '../../utils/cypress-app-wrapper';
import { rest } from 'msw';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import { CompanyProvider } from 'src/hooks/use-company';

describe('<CreatorPage />', () => {
    before(async () => {
        worker.start();
    });

    it('renders', () => {
        testMount(
            <CompanyProvider>
                <CreatorPage creator_id="abc-creator" platform="youtube" />
            </CompanyProvider>,
        );
    });
    it('shows loading state, then shows report', () => {
        testMount(
            <CompanyProvider>
                <CreatorPage creator_id="abc-creator" platform="youtube" />
            </CompanyProvider>,
        );
        cy.contains('Generating influencer Report. Please wait');
        cy.contains('T-Series');
    });
    it('shows error when cannot load report', () => {
        // override the default mocks in mocks/browser.ts
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (req, res, ctx) => {
                return res(ctx.json({ error: 'error' }));
            }),
        );
        testMount(
            <CompanyProvider>
                <CreatorPage creator_id="abc-creator" platform="youtube" />
            </CompanyProvider>,
        );
        cy.contains('Failed to fetch report');
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
