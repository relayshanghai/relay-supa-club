/// <reference types="@testing-library/cypress" />
// @ts-check
import { worker } from 'src/mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { PricingPage } from './pricing-page';

describe('PricingPage', () => {
    before(async () => {
        await worker.start();
    });

    it('shows title, subtitle, etc.', () => {
        testMount(<PricingPage />);
        cy.findAllByText('Just getting started, or scaling up.');
        cy.findByText('relay.club can help.');
        // has price details formatted
        cy.contains('900 Influencer Searches');
        cy.contains('Full Customer Service');
    });
    it('loads the prices from subscription/prices endpoint', () => {
        testMount(<PricingPage />);
        // shows loading state first.
        cy.contains('$220').should('not.exist');
        cy.contains('299');
        cy.contains('$--').should('not.exist');
    });
});
