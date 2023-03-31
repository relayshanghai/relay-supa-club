import React from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchContext } from '../../hooks/use-search';
import type { CreatorSearchAccountObject } from '../../../types';
import type { CampaignsIndexGetResult } from '../../../pages/api/campaigns';
const creator: CreatorSearchAccountObject = {
    account: {
        user_profile: {
            user_id: '25025320',
            username: 'instagram',
            url: 'https://www.instagram.com/instagram/',
            picture:
                'https://imgp.sptds.icu/v2?mb0KwpL92uYofJiSjDn1%2F6peL1lBwv3s%2BUvShHERlDaDVMq5CUHy%2BkcsdYgF20nDsuUwkRjFVav5M3TrTU9h7%2BxcZBxCJ2RhABotd8JjaVVGHFCcdShtZRKywU%2BQReCwgNlJUwVYqIiahjW32e%2BqWA%3D%3D',
            fullname: 'Instagram',
            is_verified: true,
            account_type: 3,
            followers: 623864231,
            engagements: 530325,
            engagement_rate: 0.000850064763530256,
        },
        audience_source: 'followers',
    },
    match: {},
};
const campaigns: CampaignsIndexGetResult = [
    {
        id: '2fefe314-b457-4812-95a5-9d9d73e2eb0d',
        created_at: '2023-02-12T02:52:44.285648+00:00',
        name: 'Jim Test Campaign February 2023',
        description: 'Jim is testing relay.club for bugs.',
        company_id: 'd2d8534b-65c3-4e21-89a7-f8c9aa570b79',
        product_link:
            'https://www.amazon.com/Triplett-USB-Bug-Tester-Masker-Black/dp/B07J5PD4KF/ref=sr_1_1?crid=28004DEESA8QR&keywords=bug+tester&qid=1676170167&sprefix=b%2Caps%2C1274&sr=8-1',
        status: 'not started',
        budget_cents: 15000,
        budget_currency: 'USD',
        creator_count: null,
        date_end_creator_outreach: null,
        date_start_campaign: '2023-02-20T00:00:00+00:00',
        date_end_campaign: '2023-02-24T00:00:00+00:00',
        slug: 'jim-test-campaign-february-2023',
        product_name: "JIm's Bug Tester",
        requirements: null,
        tag_list: ['pets'],
        promo_types: ['Dedicated Video', 'Integrated Video'],
        target_locations: ['United States of America'],
        media: [{}],
        purge_media: [],
        media_path: null,
        companies: {
            id: 'd2d8534b-65c3-4e21-89a7-f8c9aa570b79',
            name: 'relay.club',
            cus_id: 'cus_NKXV4aQYAU7GXG',
        },
        campaign_creators: [
            {
                id: 'e8ad89fa-fa11-4c77-857e-ccad146d85e0',
                created_at: '2023-02-12T03:01:51.468377+00:00',
                status: 'confirmed',
                campaign_id: '2fefe314-b457-4812-95a5-9d9d73e2eb0d',
                updated_at: null,
                relay_creator_id: null,
                creator_model: null,
                creator_token: null,
                interested: null,
                email_sent: null,
                publication_date: null,
                rate_cents: 0,
                rate_currency: 'USD',
                payment_details: null,
                payment_status: "'unpaid'::text",
                paid_amount_cents: 0,
                paid_amount_currency: 'USD',
                address: null,
                sample_status: "'unsent'::text",
                tracking_details: null,
                reject_message: null,
                brief_opened_by_creator: null,
                need_support: null,
                next_step: null,
                avatar_url:
                    'https://yt3.googleusercontent.com/HC73BJpS2s8QX-ns_mj84DDqFZv8QUcs0Lq4YZsADkPjq8h6B74Sk4O6SpXz4A00f51fQ-Y5=s480-c-k-c0x00ffffff-no-rj',
                username: null,
                fullname: 'Mattheww Brennan',
                link_url: 'https://www.youtube.com/channel/UCJQjhL019_F0nckUU88JAJA',
                creator_id: 'UCJQjhL019_F0nckUU88JAJA',
                platform: 'youtube',
                added_by_id: '9bfbc685-2881-47ac-b75a-c7e210f187f2',
            },
            {
                id: '3e039a03-38fe-40e0-b233-6a8294fc0258',
                created_at: '2023-02-12T03:16:56.031044+00:00',
                status: 'to contact',
                campaign_id: '2fefe314-b457-4812-95a5-9d9d73e2eb0d',
                updated_at: null,
                relay_creator_id: null,
                creator_model: null,
                creator_token: null,
                interested: null,
                email_sent: null,
                publication_date: null,
                rate_cents: 0,
                rate_currency: 'USD',
                payment_details: null,
                payment_status: "'unpaid'::text",
                paid_amount_cents: 0,
                paid_amount_currency: 'USD',
                address: null,
                sample_status: "'unsent'::text",
                tracking_details: null,
                reject_message: null,
                brief_opened_by_creator: null,
                need_support: null,
                next_step: null,
                avatar_url:
                    'https://yt3.googleusercontent.com/ytc/AL5GRJVmWBDYbrDzGeCbIur9i83EnPLXGezeZEcGAn4vwA=s480-c-k-c0x00ffffff-no-rj',
                username: null,
                fullname: "Naomi 'SexyCyborg' Wu",
                link_url: 'https://www.youtube.com/channel/UCh_ugKacslKhsGGdXP0cRRA',
                creator_id: 'UCh_ugKacslKhsGGdXP0cRRA',
                platform: 'youtube',
                added_by_id: '9bfbc685-2881-47ac-b75a-c7e210f187f2',
            },
        ],
    },
];

const setupProps = () => {
    cy.viewport(1920, 1080);

    return {
        creator,
        campaigns,
        setSelectedCreator: cy.stub(),
        setShowCampaignListModal: cy.stub(),
        setShowAlreadyAddedModal: cy.stub(),
        setCampaignsWithCreator: cy.stub(),
    };
};

import { SearchResultRow } from './search-result-row';
describe('<CreatorPage />', () => {
    before(async () => {
        const { worker } = await import('../../mocks/browser');
        worker.start();
    });

    it('renders', () => {
        testMount(<SearchResultRow {...setupProps()} />);
        cy.contains('@instagram');
        cy.contains('Add to campaign');
    });
    it('shows recommended tag ', () => {
        // Note that we will need to rewrite this when we update the list of recommended creators. right now we have set the instagram platform account to be recommended
        testMount(
            <SearchContext.Provider value={{ platform: 'instagram' } as any}>
                <SearchResultRow {...setupProps()} />
            </SearchContext.Provider>,
        );
        cy.contains('Recommended');
    });
    it('does not show recommended tag for other accounts', () => {
        // Note that we will need to rewrite this when we update the list of recommended creators. right now we have set the instagram platform account to be recommended
        const props = setupProps();
        props.creator.account.user_profile.user_id = 'notinstagram';
        testMount(
            <SearchContext.Provider value={{ platform: 'instagram' } as any}>
                <SearchResultRow {...props} />
            </SearchContext.Provider>,
        );
        cy.contains('Recommended').should('not.exist');
    });
    it.only('shows tooltip on badge hover', () => {
        testMount(
            // needs some room to show the tooltip
            <div className="pt-5">
                <SearchContext.Provider value={{ platform: 'instagram' } as any}>
                    <SearchResultRow {...setupProps()} />
                </SearchContext.Provider>
            </div>,
        );
        cy.contains(
            'Are those which have worked with relay.club brands in the past and are known to be open to cooperation',
        ).should('not.be.visible');
        // .trigger('mouseenter') should work but it doesn't
        cy.get('[data-testid=recommended-badge').click();
        cy.contains(
            'Are those which have worked with relay.club brands in the past and are known to be open to cooperation',
        ).should('be.visible');
    });
});
// Prevent TypeScript from reading file as legacy script
export {};
