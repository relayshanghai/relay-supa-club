/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from '../../utils/cypress-app-wrapper';
import React, { useState } from 'react';
import { ManageInfluencerModal } from './manage-influencer-modal';
import type { ManageInfluencerModalProps } from './manage-influencer-modal';
import type { CampaignCreatorDB } from 'src/utils/api/db';

import { worker } from '../../mocks/browser';
const blankCreatorArgs: CampaignCreatorDB = {
    platform: 'youtube',
    status: 'to contact',
    username: null,
    added_by_id: '',
    address: null,
    avatar_url: '',
    brief_opened_by_creator: false,
    campaign_id: null,
    created_at: null,
    creator_id: '',
    creator_model: null,
    creator_token: null,
    email_sent: false,
    fullname: null,
    id: '',
    interested: false,
    link_url: null,
    need_support: false,
    next_step: null,
    paid_amount: 0,
    payment_currency: '',
    payment_details: null,
    payment_status: '',
    publication_date: null,
    payment_rate: 0,
    rate_currency: '',
    reject_message: null,
    sample_status: '',
    tracking_details: null,
    updated_at: null,
    relay_creator_id: 0,
    influencer_social_profiles_id: '',
};
const creator: CampaignCreatorDB = {
    ...blankCreatorArgs,
    fullname: 'T-Series',
    username: 'tseries',
    id: 'test-creator-id',
};
const props: ManageInfluencerModalProps = {
    creator,
    visible: true,
    onClose: () => undefined,
    openMoveInfluencerModal: () => undefined,
    openNotes: () => undefined,
    deleteCampaignCreator: async () => undefined,
    updateCampaignCreator: async () => undefined,
};

describe('Add', () => {
    before(async () => {
        cy.intercept('POST', '/api/track*', { status: true });
        await worker.start();
    });
    it('Should display a modal with Manage Influencer as the title, and includes the influencers handle', () => {
        testMount(<ManageInfluencerModal {...props} />);
        cy.contains('h2', 'Manage Influencer');
        cy.contains('T-Series');
    });
    it('Should display a row of small buttons to move, delete, and add notes to the influencer', () => {
        const stubbedProps = { ...props };
        stubbedProps.deleteCampaignCreator = cy.stub().as('deleteCampaignCreator');
        stubbedProps.openMoveInfluencerModal = cy.stub().as('openMoveInfluencerModal');
        stubbedProps.openNotes = cy.stub().as('openNotes');

        testMount(<ManageInfluencerModal {...stubbedProps} />);
        cy.getByTestId('delete-influencer').click();
        cy.get('@deleteCampaignCreator').should('be.calledOnce');
        cy.getByTestId('show-move-influencer').click();
        cy.get('@openMoveInfluencerModal').should('be.calledOnce');
        cy.getByTestId('show-influencer-notes').click();
        cy.get('@openNotes').should('be.calledOnce');
    });
    it('Should have button to change the status of the influencer', () => {
        testMount(<ManageInfluencerModal {...props} />);
        cy.contains('Status');
        cy.contains('select', 'To Contact').select('Contacted');
        cy.contains('select', 'Contacted').select('Posted');
        cy.contains('select', 'Posted').select('To Contact');
    });
    it('Should have View Contact Info button', () => {
        testMount(<ManageInfluencerModal {...props} />);
        cy.contains('button', 'View Contact Info');
    });
    it('Should have input fields for Influencer Fee, Next Action Point, Payment Info, Sales, Payment Amount, Address, Publication Date, and Sample Status. These should be prefilled with the influencer data', () => {
        const stubbedProps = { ...props };
        stubbedProps.creator = {
            ...creator,
            id: 'test-creator-id',
            payment_currency: 'USD',
            payment_rate: 100.3,
            payment_details: 'Paypal',
            paid_amount: 200.5,
            publication_date: '2021-01-01',
            next_step: 'Send email',
            address: '123 Main St',
            sample_status: 'Sent',
        };
        testMount(<ManageInfluencerModal {...stubbedProps} />);

        cy.contains('div', 'Influencer Fee (USD)').within(() => {
            cy.get('input').should('have.value', '100.3').clear().type('2.4').should('have.value', '2.4');
        });

        cy.contains('div', 'Payment Info').within(() => {
            cy.get('input').should('have.value', 'Paypal').clear().type('Venmo').should('have.value', 'Venmo');
        });
        cy.contains('div', 'Paid Amount (USD)').within(() => {
            cy.get('input').should('have.value', '200.5').clear().type('2.2').should('have.value', '2.2');
        });

        cy.contains('div', 'Next Action Point').within(() => {
            cy.get('input')

                .should('have.value', 'Send email')
                .clear()
                .type('Send invoice')
                .should('have.value', 'Send invoice');
        });
        cy.contains('div', 'Address').within(() => {
            cy.get('input')
                .should('have.value', '123 Main St')
                .clear()
                .type('456 Main St')
                .should('have.value', '456 Main St');
        });
    });
    it('When save is clicked, sends a request to the server to update the influencer', () => {
        const stubbedProps = {
            ...props,
            creator: {
                ...creator,
                payment_currency: 'USD',
                payment_rate: 100.3,
            },
        };
        stubbedProps.updateCampaignCreator = cy.stub().as('updateCampaignCreator');
        testMount(<ManageInfluencerModal {...stubbedProps} />);

        cy.contains('div', 'Influencer Fee (USD)').within(() => {
            cy.get('input').should('have.value', '100.3').clear().type('2.4').should('have.value', '2.4');
        });

        cy.contains('button', 'Save').click();
        cy.get('@updateCampaignCreator').should('be.calledWith', {
            ...creator,
            payment_currency: 'USD',
            payment_rate: 2.4,
        });
        cy.get('@updateCampaignCreator').should('be.calledOnce');
    });

    it('Cancel button closes the modal', () => {
        const Component = () => {
            const [visible, setVisible] = useState(true);
            return (
                <div>
                    <ManageInfluencerModal {...props} visible={visible} onClose={() => setVisible(false)} />
                </div>
            );
        };
        testMount(<Component />);
        cy.contains('Manage Influencer').should('exist');
        cy.contains('button', 'Cancel').click();
        cy.contains('Manage Influencer').should('not.exist');
    });

    it('Disables save button if there are validation errors', () => {
        testMount(<ManageInfluencerModal {...props} />);
        cy.contains('Must be a number').should('not.exist');

        cy.contains('div', 'Influencer Fee ()').within(() => {
            cy.get('input').should('have.value', '0').clear().type('asdf');
        });
        cy.contains('Must be a number').should('exist');

        cy.contains('button', 'Save').should('be.disabled');
    });
});
