/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from '../../utils/cypress-app-wrapper';
import React from 'react';
import { AddPostModal } from './add-post-modal';
import type { AddPostModalProps } from './add-post-modal';
import type { CampaignCreatorDB } from 'src/utils/api/db';

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
};
const props: AddPostModalProps = {
    creator,
    visible: true,
    onClose: () => {
        //
    },
};
describe('AddPostModal', () => {
    it('Should display a modal with Manage Posts as the title, and subtitle Add Post URL', () => {
        testMount(<AddPostModal {...props} />);
        cy.contains('h2', 'Manage Posts');
        cy.contains('h3', 'Add Post URL');
    });
});
