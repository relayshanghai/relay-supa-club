/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-iframe" />
// @ts-check
import { OnboardPaymentSection } from './onboard-payment-section';
import React from 'react';
import { testMount } from '../utils/cypress-app-wrapper';
// import { rest } from 'msw';
// import { APP_URL_CYPRESS, worker } from '../mocks/browser';

describe('<OnboardPaymentSection />', () => {
    // before(async () => {
    //     worker.start();
    // });
    const priceId = '123';

    it('renders with activate trial button', () => {
        testMount(<OnboardPaymentSection priceId={priceId} />);
        cy.contains('button', 'Activate Trial').should('not.be.disabled');
        cy.iframe('iframe[title="Secure payment input frame"]').within(() => {
            cy.contains('Country', { timeout: 10000 }); // takes some time
            cy.contains('Expiration');
            cy.contains('Card number');
        });
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
