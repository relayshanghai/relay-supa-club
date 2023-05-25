/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from '../../utils/cypress-app-wrapper';
import React from 'react';
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
    paid_amount_cents: 0,
    paid_amount_currency: '',
    payment_details: null,
    payment_status: '',
    publication_date: null,
    rate_cents: 0,
    rate_currency: '',
    reject_message: null,
    sample_status: '',
    tracking_details: null,
    updated_at: null,
    relay_creator_id: 0,
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
};

describe('Add', () => {
    before(async () => {
        await worker.start();
    });
    it('Should display a modal with Manage Influencer as the title, and includes the influencers handle', () => {
        testMount(<ManageInfluencerModal {...props} />);
        cy.contains('h2', 'Manage Influencer');
        cy.contains('T-Series');
    });
    it.skip('Should display a row of small buttons to move, delete, and add notes to the influencer');
    it.skip('Should have buttons for view contact info, change status, save, and cancel');
    it.skip('When save is clicked, sends a request to the server to update the influencer');
});
