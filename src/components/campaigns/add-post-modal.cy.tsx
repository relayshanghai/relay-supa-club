/// <reference types="@testing-library/cypress" />
// @ts-check

import { testMount } from '../../utils/cypress-app-wrapper';
import React from 'react';
import { AddPostModal } from './add-post-modal';
import type { AddPostModalProps, PostInfo } from './add-post-modal';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { rest } from 'msw';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';
import type { InfluencerPostPostResponse } from 'pages/api/influencer/posts';

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
    campaign_id: 'test-campaign-id',
};
const props: AddPostModalProps = {
    creator,
    visible: true,
    onClose: () => {
        //
    },
};

const youtubeLink = 'https://www.youtube.com/watch?v=UzL-0vZ5-wk';
const youtubeLink2 = 'https://youtu.be/UzL-0vZ5-wk';
const instagramLink = 'https://www.instagram.com/p/Cr3aeZ7NXW3/';
const tiktokLink =
    'https://www.tiktok.com/@graceofearth/video/7230816093755936043?_r=1&_t=8c9DNKVO2Tm&social_sharing=v2';
const tiktokM = 'https://vm.tiktok.com/@graceofearth/video/7230816093755936043';
const tiktokT =
    'https://vt.tiktok.com/@graceofearth/video/7230816093755936043?is_from_webapp=1&sender_device=pc&web_id=7214153327838512682';

describe('AddPostModal', () => {
    beforeEach(async () => {
        await worker.start();
    });
    it('Should display a modal with Manage Posts as the title, and subtitle Add Post URL', () => {
        testMount(<AddPostModal {...props} />);
        cy.contains('h2', 'Manage Posts');
        cy.contains('h3', 'Add Post URL');
    });
    it('Should accept valid link that contains Instagram YouTube or TikTok links and show error otherwise', () => {
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
        cy.get('input').clear().type(tiktokM);
        cy.get('button').contains('Submit').should('not.be.disabled');
        cy.get('input').clear().type(tiktokT);
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
            rest.get(`${APP_URL_CYPRESS}/api/influencer/${creator.id}/posts`, (_req, res, ctx) => {
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
    it('Sends a request to the backend to add posts, shows a toast on success, displays the new URL, and removes them from the inputs', () => {
        const mockPostData: PostInfo = {
            title: 'initial post title',
            postedDate: new Date('2021-09-01').toISOString(),
            id: 'initial-post-id',
            url: 'https://www.youtube.com/watch?v=123',
        };
        const successRes: InfluencerPostPostResponse = {
            successful: [
                {
                    title: 'test post title',
                    postedDate: new Date('2021-09-01').toISOString(),
                    id: 'test-post-id',
                    url: 'https://www.youtube.com/watch?v=456',
                    performance: null,
                },
            ],
            failed: [],
        };
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/influencer/${creator.id}/posts`, (_req, res, ctx) => {
                return res(ctx.json([mockPostData]));
            }),
            rest.post(`${APP_URL_CYPRESS}/api/influencer/posts`, (_req, res, ctx) => {
                return res(ctx.delay(500), ctx.json(successRes));
            }),
        );
        testMount(<AddPostModal {...props} />);
        cy.get('input').type(youtubeLink);
        cy.get('button').contains('Submit').click();
        cy.contains(/successfully added 1 URL/i);
        cy.contains('a', 'test post title').should('have.attr', 'href', 'https://www.youtube.com/watch?v=456');
    });
    it('Shows a failure toast if the request fails, and keeps the URLs in the list of inputs', () => {
        const mockPostData: PostInfo = {
            title: 'initial post title',
            postedDate: new Date('2021-09-01').toISOString(),
            id: 'initial-post-id',
            url: 'https://www.youtube.com/watch?v=123',
        };
        const successRes: InfluencerPostPostResponse = {
            successful: [],
            failed: ['https://www.youtube.com/watch?v=456'],
        };
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/influencer/${creator.id}/posts`, (_req, res, ctx) => {
                return res(ctx.json([mockPostData]));
            }),
            rest.post(`${APP_URL_CYPRESS}/api/influencer/posts`, (_req, res, ctx) => {
                return res(ctx.delay(100), ctx.json(successRes));
            }),
        );
        testMount(<AddPostModal {...props} />);
        cy.get('input').type('https://www.youtube.com/watch?v=456');
        cy.get('button').contains('Submit').click();
        cy.contains(/Failed to get post data for 1 URL/i);
        cy.get('input').should('have.length', 1);
        cy.get('input').should('have.value', 'https://www.youtube.com/watch?v=456');
    });
    it('handles remove post (delete button)', () => {
        const mockPostData: PostInfo = {
            title: 'initial post title',
            postedDate: new Date('2021-09-01').toISOString(),
            id: 'initial-post-id',
            url: 'https://www.youtube.com/watch?v=123',
        };
        const mockPostData2: PostInfo = {
            title: 'initial post title2',
            postedDate: new Date('2021-09-01').toISOString(),
            id: 'initial-post-id2',
            url: 'https://www.youtube.com/watch?v=1232',
        };
        worker.use(
            rest.get(`${APP_URL_CYPRESS}/api/influencer/${creator.id}/posts`, (_req, res, ctx) => {
                return res(ctx.json([mockPostData, mockPostData2]));
            }),
            rest.delete(`${APP_URL_CYPRESS}/api/influencer/posts/${mockPostData2.id}`, (_req, res, ctx) => {
                return res(ctx.delay(100), ctx.json(mockPostData2));
            }),
        );

        testMount(<AddPostModal {...props} />);
        cy.findAllByRole('link').should('have.length', 3); // 2 posts and the influencer handle link
        cy.contains('h4', mockPostData.title);
        cy.contains('h4', mockPostData2.title);

        cy.getByTestId('delete-creator').eq(1).click();
        cy.findAllByRole('link').should('have.length', 2);
        cy.contains('h4', mockPostData.title);
        cy.contains('h4', mockPostData2.title).should('not.exist');
    });
});
