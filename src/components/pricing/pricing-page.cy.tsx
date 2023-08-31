/// <reference types="@testing-library/cypress" />
// @ts-check
import { worker } from 'src/mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { PricingPage } from './pricing-page';
import { featNewPricing } from 'src/constants/feature-flags';

describe('PricingPage', () => {
    before(async () => {
        await worker.start();
    });

    it('shows title, subtitle, etc.', () => {
        testMount(<PricingPage />);
        cy.findAllByText('Just getting started, or scaling up.');
        cy.findByText('relay.club can help.');

        // has switch for monthly/quarterly
        if (!featNewPricing) {
            cy.findByRole('checkbox');
            cy.contains('Monthly');
            cy.contains('Quarterly');
            cy.contains('DIY Max');
        }

        // has price details formatted
        cy.contains(featNewPricing() ? '900 Influencer Searches' : 'Up to 50,000 Influencer Search Results');
        cy.contains(featNewPricing() ? 'Full Customer Service' : '2,000 AI Generated Email Templates');
    });
    it.only('loads the prices from subscription/prices endpoint', () => {
        testMount(<PricingPage />);
        // shows loading state first.
        cy.contains('$220').should('not.exist');
        cy.contains(featNewPricing() ? '299' : '$--');
        // then gets prices
        cy.contains(featNewPricing() ? '299' : '$220');
        cy.contains('$--').should('not.exist');
    });
});
