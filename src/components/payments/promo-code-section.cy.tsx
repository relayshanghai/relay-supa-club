/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from '../../utils/cypress-app-wrapper';
import type { NewRelayPlan } from 'types';
import { PromoCodeSection } from './promo-code-section';
import { worker } from 'src/mocks/browser';

const selectedPrice: NewRelayPlan = {
    currency: 'cny',
    prices: {
        monthly: '799.00',
    },
    profiles: '600',
    searches: '1200',
    priceIds: {
        monthly: 'price_xxx',
    },
};
const priceTier = 'discovery';

describe('<PromoCodeSection />', () => {
    before(async () => {
        worker.start();
    });

    it('renders the promo code section correctly', () => {
        const setCouponId = cy.stub();
        testMount(<PromoCodeSection selectedPrice={selectedPrice} setCouponId={setCouponId} priceTier={priceTier} />);

        cy.get('label').should('contain', 'Promo Code');
        cy.get('input').should('have.attr', 'placeholder', 'Enter a Promo Code');
        cy.get('button').should('contain', 'Apply');
    });

    it('show error message when entered invalid promo code', () => {
        const setCouponId = cy.stub();
        testMount(<PromoCodeSection selectedPrice={selectedPrice} setCouponId={setCouponId} priceTier={priceTier} />);
        cy.get('input').type('test');
        cy.contains('button', 'Apply').click();
        cy.get('p').should('contain', 'Invalid Promo Code');
    });

    it('show show success message when entered valid promo code', () => {
        const setCouponId = cy.stub();
        testMount(<PromoCodeSection selectedPrice={selectedPrice} setCouponId={setCouponId} priceTier={priceTier} />);
        cy.get('input').type('PH2023');
        cy.contains('button', 'Apply').click();
        cy.get('p').should('contain', 'Off for next 3 month(s)');
    });
});
