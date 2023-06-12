/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-iframe" />
// @ts-check
import { OnboardPaymentSection } from './onboard-payment-section';
import React from 'react';
import { testMount } from '../utils/cypress-app-wrapper';
import { rest } from 'msw';
import { APP_URL_CYPRESS, worker } from '../mocks/browser';

describe('<OnboardPaymentSection />', () => {
    before(async () => {
        worker.start();
    });
    const priceId = '123';

    it('Enables button when info complete, disables when info wrong', () => {
        testMount(<OnboardPaymentSection priceId={priceId} />);
        cy.contains('button', 'Start Free Trial').should('be.disabled');
        cy.iframe('iframe[title="Secure payment input frame"]').within(() => {
            cy.contains('Country', { timeout: 10000 }); // takes some time
            cy.contains('Expiration');
            cy.contains('Card number');
            cy.get('input[autocomplete="billing cc-number"]').type('4242424242424242');
            cy.get('input[autocomplete="billing cc-exp"]').type('1227');
            cy.get('input[autocomplete="billing cc-csc"]').type('123');
            //cy.get('input[autocomplete="billing postal-code"]').type('12345');
        });
        cy.contains('button', 'Start Free Trial').should('not.be.disabled');
        cy.iframe('iframe[title="Secure payment input frame"]').within(() => {
            cy.get('input[autocomplete="billing cc-exp"]').clear().type('1219'); // in the past
        });
        cy.contains('button', 'Start Free Trial').should('be.disabled');
    });
    it('Handles payment request', () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/subscriptions/create-subscription`, (req, res, ctx) => {
                return res(ctx.status(500), ctx.json({ error: 'custom error' }));
            }),
        );
        testMount(<OnboardPaymentSection priceId={priceId} />);
        cy.contains('button', 'Start Free Trial').should('be.disabled');
        cy.iframe('iframe[title="Secure payment input frame"]').within(() => {
            cy.contains('Country', { timeout: 10000 });
            cy.get('input[autocomplete="billing cc-number"]').type('4242424242424242');
            cy.get('input[autocomplete="billing cc-exp"]').type('1227');
            cy.get('input[autocomplete="billing cc-csc"]').type('123');
            //cy.get('input[autocomplete="billing postal-code"]').type('12345');
        });
        cy.contains('button', 'Start Free Trial').click();
        cy.contains('custom error');
    });
    it('Handles success', () => {
        // note that we can't test the real payment success because stripe will need a 'clientSecret' sent from the backend, so in this test we can just make sure that tne backend returns the right data and the stripe call is triggered
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/subscriptions/create-subscription`, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json({ clientSecret: '123' }));
            }),
        );
        testMount(<OnboardPaymentSection priceId={priceId} />);
        cy.contains('button', 'Start Free Trial').should('be.disabled');
        cy.iframe('iframe[title="Secure payment input frame"]').within(() => {
            cy.contains('Country', { timeout: 10000 });
            cy.get('input[autocomplete="billing cc-number"]').type('4242424242424242');
            cy.get('input[autocomplete="billing cc-exp"]').type('1227');
            cy.get('input[autocomplete="billing cc-csc"]').type('123');
            //cy.get('input[autocomplete="billing postal-code"]').type('12345');
        });
        cy.contains('button', 'Start Free Trial').click();
        cy.contains('button', 'Start Free Trial').click();
        // To manually test the success case, just comment out the `stripe.confirmPayment()` call.
        cy.contains('You must pass in a clientSecret when calling stripe.confirmPayment().');
        // cy.contains('Success');
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
