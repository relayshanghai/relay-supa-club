/// <reference types="@testing-library/cypress" />
import React from 'react';
import type { SubscriptionConfirmModalData, SubscriptionConfirmModalProps } from './subscription-confirm-modal';
import { SubscriptionConfirmModal } from './subscription-confirm-modal';
import { worker } from '../../mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
// import { rest } from 'msw';

const confirmModalData: SubscriptionConfirmModalData = {
    plan: 'diyMax',
    period: 'monthly',
    priceId: 'price_123',
    price: '150',
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
        cy.contains('150/month. Billed monthly');
        cy.findByRole('button', { name: 'Subscribe' }).should('not.be.disabled').click();
        cy.findByRole('button', { name: 'Back to account' }).then(() => {
            expect(createSubscription).to.be.called;
        });
    });
    it('lets user input a coupon and check it', () => {
        const setConfirmModalData = cy.stub();
        const createSubscription = cy.stub();
        const props: SubscriptionConfirmModalProps = {
            confirmModalData,
            setConfirmModalData,
            createSubscription,
        };

        testMount(<SubscriptionConfirmModal {...props} />);
        cy.get('input').type('testCoupon');
        cy.get('button').contains('Check').click();
        cy.contains('0/month. Billed monthly');
    });
});

export {};
