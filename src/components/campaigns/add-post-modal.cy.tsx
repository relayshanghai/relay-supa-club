/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from '../../utils/cypress-app-wrapper';
import React from 'react';
import { AddPostModal } from './add-post-modal';
import type { AddPostModalProps, PostInfo } from './add-post-modal';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { rest } from 'msw';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
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
const props: AddPostModalProps = {
    creator,
    visible: true,
    onClose: () => {
        //
    },
};

const youtubeLink = 'https://www.youtube.com/channel/UClf-gnZdtIffbPPhOq3CelA';
const youtubeLink2 = 'https://youtu.be/channel/UClf-gnZdtIffbPPhOq3CelA';
const instagramLink = 'https://www.instagram.com/relay.club/?hl=en';
const tiktokLink = 'https://vm.tiktok.com/ZSd2GkJrM/';

describe('AddPostModal', () => {
    before(async () => {
        await worker.start();
    });
    it('Should display a modal with Manage Posts as the title, and subtitle Add Post URL', () => {
        testMount(<AddPostModal {...props} />);
        cy.contains('h2', 'Manage Posts');
        cy.contains('h3', 'Add Post URL');
    });
    it('Should accept valid link that contains instagram youtube or tiktok links and show error otherwise', () => {
        testMount(<AddPostModal {...props} />);
        cy.contains('Invalid URL').should('not.exist');

        cy.get('input').type(youtubeLink);
        cy.get('button').contains('Submit').should('not.be.disabled');
        cy.contains('Invalid URL').should('not.exist');
        cy.get('input').clear().type(youtubeLink2);
        cy.get('button').contains('Submit').should('not.be.disabled');
        cy.get('input').clear().type(instagramLink);
        cy.get('button').contains('Submit').should('not.be.disabled');
        cy.get('input').clear().type(tiktokLink);
        cy.get('button').contains('Submit').should('not.be.disabled');

        cy.get('input').clear().type('https://www.elsewhere.com/asdf');
        cy.get('button').contains('Submit').should('be.disabled');
        cy.contains('Invalid URL');
    });
    it('Should allow user to add more than one URL. It should display an error if a user adds a duplicate url', () => {
        testMount(<AddPostModal {...props} />);
        cy.contains('Duplicate URL').should('not.exist');

        cy.get('input').type(youtubeLink);
        cy.get('button').contains('Submit').should('not.be.disabled');
        cy.contains('button', 'Add Another Post').click();
        cy.get('input').eq(1).type(youtubeLink2);
        cy.get('button').contains('Submit').should('not.be.disabled');
        cy.contains('Duplicate URL').should('not.exist');

        cy.contains('button', 'Add Another Post').click();
        cy.get('input').eq(2).type(youtubeLink2);
        cy.get('button').contains('Submit').should('be.disabled');
        cy.contains('Duplicate URL').should('exist');
    });
    it('Should display a list of posts that have been added. Each item should be a clickable link to that post in a new window', () => {
        const mockPostData: PostInfo = {
            title: 'test post title',
            postedDate: new Date('2021-09-01').toISOString(),
            id: 'test-post-id',
            url: 'https://www.youtube.com/watch?v=123',
        };
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/posts/${creator.id}`, (req, res, ctx) => {
                return res(ctx.json([mockPostData]));
            }),
        );
        testMount(<AddPostModal {...props} />);
        cy.contains('h3', 'Current Posts');
        cy.contains('h4', mockPostData.title);
        cy.contains('Wed, Sep 1, 2021, 12:00 AM');
        cy.contains('a', mockPostData.title).should('have.attr', 'href', mockPostData.url);
        cy.contains('a', mockPostData.title).should('have.attr', 'target', '_blank');
        cy.contains('a', mockPostData.title).should('have.attr', 'rel', 'noopener noreferrer');
    });
    it.skip(
        'Sends a request to the backend to add posts, shows a toast on success, displays the new urls, and removes them from the inputs',
    );
    it.skip('Shows a failure toast if the request fails, and keeps the URLs in the list of inputs');
    it.skip('handles remove post (delete button)');
});
