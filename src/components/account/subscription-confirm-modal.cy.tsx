/// <reference types="@testing-library/cypress" />
import React from 'react';
import type { SubscriptionConfirmModalData, SubscriptionConfirmModalProps } from './subscription-confirm-modal';
import { SubscriptionConfirmModal } from './subscription-confirm-modal';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import { rest } from 'msw';
// import { rest } from 'msw';

const confirmModalData: SubscriptionConfirmModalData = {
    plan: 'diyMax',
    period: 'monthly',
    priceId: 'price_123',
    price: '$199.00',
};
const couponRes = {
    id: '100_percent_off_timekettle',
    object: 'coupon',
    amount_off: null,
    created: 1680683208,
    currency: null,
    duration: 'forever',
    duration_in_months: null,
    livemode: false,
    max_redemptions: 1,
    metadata: {},
    name: '100% Off Timekettle',
    percent_off: 100,
    redeem_by: null,
    times_redeemed: 0,
    valid: true,
};

describe('<SubscriptionConfirmModal />', () => {
    before(async () => {
        worker.start();
    });
    it('renders with payment and plan details', () => {
        // worker.use(rest.get(`${APP_URL_CYPRESS}/`))
        const setConfirmModalData = cy.stub();
        const createSubscription = cy.stub();
        const props: SubscriptionConfirmModalProps = {
            confirmModalData,
            setConfirmModalData,
            createSubscription,
        };

        testMount(<SubscriptionConfirmModal {...props} />);
        cy.contains('DIY Max plan');
        cy.contains('You are about to subscribe for');
        cy.contains('$199.00/month. Billed monthly');
        cy.findByRole('button', { name: 'Subscribe' }).should('not.be.disabled').click();
        cy.findByRole('button', { name: 'Back to account' }).then(() => {
            expect(createSubscription).to.be.called;
        });
    });
    it('lets user input a coupon and check it', () => {
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/subscriptions/coupon`, (req, res, ctx) => res(ctx.json(couponRes))),
        );
        const setConfirmModalData = cy.stub();
        const createSubscription = cy.stub();
        const props: SubscriptionConfirmModalProps = {
            confirmModalData,
            setConfirmModalData,
            createSubscription,
        };

        testMount(<SubscriptionConfirmModal {...props} />);
        cy.get('input').type('100_percent_off_timekettle');
        cy.get('button').contains('Apply coupon').click();
        cy.contains('$0.00/month. Billed monthly');
    });
    it('sends coupon code in createSubscription call', () => {
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/subscriptions/coupon`, (req, res, ctx) => res(ctx.json(couponRes))),
        );
        const setConfirmModalData = cy.stub();
        const createSubscription = cy.stub();
        const props: SubscriptionConfirmModalProps = {
            confirmModalData,
            setConfirmModalData,
            createSubscription,
        };

        testMount(<SubscriptionConfirmModal {...props} />);
        cy.get('input').type('100_percent_off_timekettle');
        cy.get('button').contains('Apply coupon').click();
        cy.contains('$0.00/month. Billed monthly');

        cy.get('button').contains('Subscribe').click();
        cy.findByRole('button', { name: 'Back to account' }).then(() => {
            expect(createSubscription).to.be.calledWith(confirmModalData.priceId, '100_percent_off_timekettle');
        });
    });
});

export {};
