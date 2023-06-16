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

        // has switch for monthly/quarterly
        cy.findByRole('checkbox');
        cy.contains('Monthly');
        cy.contains('Quarterly');
        cy.contains('DIY Max');

        // has price details formatted
        cy.contains('Up to 50,000 Influencer Search Results');
        cy.contains('2,000 AI Generated Email Templates');
    });
    it('loads the prices from subscription/prices endpoint', () => {
        testMount(<PricingPage />);
        // shows loading state first.
        cy.contains('$220').should('not.exist');
        cy.contains('$--');
        // then gets prices
        cy.contains('$220');
        cy.contains('$--').should('not.exist');
    });
});
