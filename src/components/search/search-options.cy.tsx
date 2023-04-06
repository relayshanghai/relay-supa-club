/// <reference types="@testing-library/cypress" />
import defaultLandingPageInfluencerSearch from '../../mocks/api/influencer-search/indexDefaultSearch.json';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchPage } from './search-page';
import { rest } from 'msw';

const companyId = 'ad942d94-41bb-441a-a4e6-66169854b865';

describe('SearchOptions', () => {
    before(() => {
        worker.start();
    });
    it('Should render search page', () => {
        testMount(<SearchPage companyId={companyId} />);

        cy.contains('Results per page');
    });

    it('Should show top default influencers', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(defaultLandingPageInfluencerSearch));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);
        cy.get('[href="/influencer/youtube/UCq-Fj5jknLsUf-MWSy4_brA"]').should('exist');
    });

    it('Should add topic tags to search', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(defaultLandingPageInfluencerSearch));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);

        cy.findByTestId('search-topics').within(() => {
            cy.get('input').type('alligators{enter}');
            cy.get('input').type('yomrwhite{enter}');
        });
        cy.contains('alligators').should('exist');
        cy.contains('yomrwhite').should('exist');
    });

    it('should be empty when we remove topic tags', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(defaultLandingPageInfluencerSearch));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);

        cy.findByTestId('search-topics').within(() => {
            cy.get('input').type('alligators{enter}');
            cy.get('input').type('yomrwhite{enter}');
        });

        cy.get('#remove-tag-alligators').should('exist').click();
        cy.get('#remove-tag-yomrwhite').should('exist').click();

        cy.findByTestId('search-topics').within(() => {
            cy.get('input').should('be.empty');
        });
    });

    it('Should delete topic tags when pressing backspace', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
                return res(ctx.json(defaultLandingPageInfluencerSearch));
            }),
        );

        testMount(<SearchPage companyId={companyId} />);

        cy.findByTestId('search-topics').within(() => {
            cy.get('input')
                .type('alligators{enter}')
                .type('yomrwhite{enter}')
                .type('{backspace}{backspace}{backspace}{backspace}{backspace}')
                .should('have.value', 'yomrw');
        });
    });
});
