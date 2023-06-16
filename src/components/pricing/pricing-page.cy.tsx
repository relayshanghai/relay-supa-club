/// <reference types="@testing-library/cypress" />
// @ts-check
import { worker } from 'src/mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { PricingPage } from './pricing-page';

describe('PricingPage', () => {
    before(async () => {
        await worker.start();
    });
    it('shows title, subtitle', () => {
        testMount(<PricingPage />);
        cy.findAllByText('Just getting started, or scaling up.');
        cy.findByText('relay.club can help.');

        // has switch for monthly/quarterly
        cy.findByRole('checkbox');
        cy.contains('Monthly');
        cy.contains('Quarterly');
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
