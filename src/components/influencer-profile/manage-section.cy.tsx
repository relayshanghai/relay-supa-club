/// <reference types="@testing-library/cypress" />
// @ts-check

import { useAtomValue } from 'jotai';
import { ManageSection } from 'src/components/influencer-profile/manage-section';
import { mockProfile, testSequenceId } from 'src/mocks/test-user';
import type { InfluencerOutreachData } from 'src/utils/outreach/types';
import i18n from 'i18n';
import { testMount } from 'src/utils/cypress-app-wrapper';
import { manageSectionUpdatingAtom } from './atoms';

Cypress.on('uncaught:exception', (_err) => {
    // ignore abort request errors.
    return false;
});

const influencer: InfluencerOutreachData = {
    id: '965072d5-2b89-4854-b50d-f20d22d1df98',
    created_at: '2023-09-06T05:16:32.072089+00:00',
    updated_at: '2023-09-06T06:06:11.909+00:00',
    added_by: mockProfile?.id,
    email: 'ekleinvt@gmail.com',
    sequence_step: 9,
    funnel_status: 'Posted',
    tags: ['culture', 'cultures', 'diversity'],
    next_step: null,
    scheduled_post_date: null,
    video_details: null,
    rate_amount: null,
    rate_currency: null,
    real_full_name: null,
    company_id: mockProfile?.company_id || '',
    sequence_id: testSequenceId,
    address_id: null,
    influencer_social_profile_id: 'f5935267-81ea-4cd1-9ba0-24e99c216bc0',
    iqdata_id: '6765597816304993286',
    manager_first_name: mockProfile?.first_name,
    name: 'Ella Klein',
    username: 'ekleinvt',
    avatar_url: 'https://p16-amd-va.tiktokcdn.com/tos-maliva-avt-0068/67456fa9aa8342692591b7b21d30f774~c5_720x720.jpeg',
    url: 'https://www.tiktok.com/@6765597816304993286',
    platform: 'tiktok',
    social_profile_last_fetched: '2023-08-31T07:28:14.856773+00:00',
    recent_post_title: 'recent post',
    recent_post_url: 'https://recent_post_url.com',
    affiliate_link: 'https://affiliate_link.com',
    commission_rate: 10.1,
};
const address = {
    id: '965072d5-2b89-4854-b50d-f20d22d1df42',
    name: 'Ms. Ella Klein',
    created_at: 'created_at',
    updated_at: 'updated_at',
    country: 'a_country',
    state: 'a_state',
    city: 'a_city',
    postal_code: 'a_postal_code',
    address_line_1: 'a_address_line_1',
    address_line_2: 'address_line_2',
    tracking_code: 'a_tracking_code',
    phone_number: 'a_phone_number',
    influencer_social_profile_id: 'influencer_social_profile_id',
};
i18n.changeLanguage('en-US');
const ComponentWithParent = () => {
    const updating = useAtomValue(manageSectionUpdatingAtom);
    return (
        <div className="m-5 max-w-xs bg-white">
            <div className="flex justify-between bg-primary-500 p-5">
                header section
                <div className="text-white">{updating ? 'updating...' : 'up to date'}</div>
            </div>
            <ManageSection influencer={influencer} address={address} />
        </div>
    );
};

describe('ManageSection', () => {
    // before(() => {
    //     worker.start();
    // });

    it('Contains section headers. Should render the form with the initial values and placeholders', () => {
        testMount(<ComponentWithParent />);
        // headers
        cy.contains('header section');
        cy.contains('h2', 'Collab');

        cy.contains('Collab Stage');
        cy.contains('Posted');

        // TODO: https://linear.app/boostbot/issue/BB-232/notes-section
        // cy.contains('Notes')
        // cy.contains('button', 'Add Note')

        cy.contains('h2', 'Compensation & Deliverables');
        cy.contains('label', 'Fixed Fee (USD)').within(() => {
            cy.findByPlaceholderText('$250').should('have.value', ''); // not set in mock, test empty state
        });
        cy.contains('label', 'Commission Rate (%)').within(() => {
            cy.findByPlaceholderText('15%').should('have.value', '10.1');
        });
        cy.contains('label', 'Affiliate Link').within(() => {
            cy.findByPlaceholderText('https://chefly.shopify.com?code=2h42b2394h2').should(
                'have.value',
                'https://affiliate_link.com',
            );
        });
        cy.contains('label', 'Scheduled Post Date');

        cy.contains('h2', 'Shipping & Personal Info');
        cy.contains('label', 'Name').within(() => {
            cy.findByPlaceholderText('Eve Leroy').should('have.value', 'Ms. Ella Klein');
        });
        cy.contains('label', 'Phone Number').within(() => {
            cy.findByPlaceholderText('1-433-3453456').should('have.value', 'a_phone_number');
        });
        cy.contains('label', 'Street Address').within(() => {
            cy.findByPlaceholderText('755 Roosevelt Street').should('have.value', 'a_address_line_1');
        });
        cy.contains('label', 'City').within(() => {
            cy.findByPlaceholderText('Chicago').should('have.value', 'a_city');
        });
        cy.contains('label', 'State').within(() => {
            cy.findByPlaceholderText('Illinois').should('have.value', 'a_state');
        });
        cy.contains('label', 'Postal Code').within(() => {
            cy.findByPlaceholderText('14450').should('have.value', 'a_postal_code');
        });
        cy.contains('label', 'Country').within(() => {
            cy.findByPlaceholderText('United States').should('have.value', 'a_country');
        });

        cy.contains('label', 'Tracking Code').within(() => {
            cy.findByPlaceholderText('FT2349834573...').should('have.value', 'a_tracking_code');
        });
        cy.contains('label', 'Full Address').within(() => {
            cy.findByPlaceholderText('755 Roosevelt Street, New York, New York, 14...').should(
                'have.value',
                'a_address_line_1, a_city, a_state, a_postal_code, a_country',
            );
        });
    });
    it.only('handles updates. shows form as updating while updating', () => {
        testMount(<ComponentWithParent />);

        // updates influencer
        // worker.use(
        //     rest.put(`${APP_URL_CYPRESS}/api/sequence-influencers`, (_req, res, ctx) => {
        //         return res(
        //             ctx.json({
        //                 ...influencer,
        //                 affiliate_link: 'https://new_affiliate_link.com',
        //             }),
        //         );
        //     }),
        // );
        cy.intercept('PUT', `http://localhost:8080/api/sequence-influencers`, {
            delay: 100,
            body: {
                ...influencer,
                affiliate_link: 'https://new_affiliate_link.com',
            },
        }).as('updateInfluencer');

        cy.contains('up to date');
        cy.findByPlaceholderText('https://chefly.shopify.com?code=2h42b2394h2')
            .should('have.value', 'https://affiliate_link.com')
            .clear()
            .type('https://new_affiliate_link.com');

        cy.contains('updating...');
        cy.wait('@updateInfluencer').its('request.body').should('have.keys', ['affiliate_link', 'id']);
        cy.contains('up to date');
        cy.findByPlaceholderText('https://chefly.shopify.com?code=2h42b2394h2').should(
            'have.value',
            'https://new_affiliate_link.com',
        );

        cy.intercept('PUT', `http://localhost:8080/api/addresses`, {
            delay: 100,
            body: { ...address, address_line_1: '113 nowhere street' },
        }).as('updateAddress');

        cy.findByPlaceholderText('755 Roosevelt Street').clear().type('113 nowhere street');
        cy.contains('updating...');
        cy.wait('@updateAddress').its('request.body').should('have.keys', ['address_line_1', 'id']);
        cy.contains('up to date');
        cy.findByPlaceholderText('755 Roosevelt Street').should('have.value', '113 nowhere street');
    });
    it.skip('typing multiple times aborts previous requests'); // not sure how to test atm
    // TODO: https://linear.app/boostbot/issue/BB-232/notes-section
    it.skip('Notes section');
});
