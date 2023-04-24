/// <reference types="@testing-library/cypress" />
// @ts-check
import { worker } from '../../mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchPage } from './search-page';

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
        testMount(<SearchPage companyId={companyId} />);
        cy.get('[href="/influencer/youtube/UCq-Fj5jknLsUf-MWSy4_brA"]').should('exist');
    });

    it('should be empty when we remove topic tags', () => {
        testMount(<SearchPage companyId={companyId} />);

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
        testMount(<SearchPage companyId={companyId} />);

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
