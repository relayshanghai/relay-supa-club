/// <reference types="@testing-library/cypress" />
// @ts-check
import { worker } from 'src/mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { PricingPage } from './pricing-page';

describe('PricingPage', () => {
    before(async () => {
        await worker.start();
    });

    it('allows user to go back to account page', () => {
        testMount(<PricingPage page="upgrade" />);
        cy.contains('a', 'Back to account').should('have.attr', 'href', '/account');
    });
});
