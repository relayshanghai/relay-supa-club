/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchContext } from '../../hooks/use-search';
import type { CreatorSearchAccountObject } from '../../../types';
import jimTestCampaign from '../../mocks/supabase/campaigns/jimTestCampaign.json';
import amyTestCampaign from '../../mocks/supabase/campaigns/amyTestCampaign.json';

const creator: CreatorSearchAccountObject = {
    account: {
        user_profile: {
            user_id: '25025320',
            username: 'instagram',
            handle: 'instagram',
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
const campaigns = [jimTestCampaign, amyTestCampaign] as any[];

const setupProps = () => {
    return {
        creator,
        campaigns,
        setSelectedCreator: cy.stub(),
        setShowCampaignListModal: cy.stub(),
        setShowAlreadyAddedModal: cy.stub(),
        setCampaignsWithCreator: cy.stub(),
        setShowSequenceListModal: cy.stub(),
        batchId: 0,
        page: 1,
        resultIndex: 0,
    };
};

import { SearchResultRow } from './search-result-row';
import { worker } from '../../mocks/browser';
import { featRecommended } from 'src/constants/feature-flags';
describe('<CreatorPage />', () => {
    before(async () => {
        worker.start();
    });

    if (featRecommended()) {
        it('shows recommended tag ', () => {
            // Note that we will need to rewrite this when we update the list of recommended creators. right now we have set the instagram platform account to be recommended
            testMount(
                <SearchContext.Provider
                    value={{ platform: 'instagram', recommendedInfluencers: ['instagram/25025320'] } as any}
                >
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
                <SearchContext.Provider
                    value={{ platform: 'instagram', recommendedInfluencers: ['instagram/25025320'] } as any}
                >
                    <SearchResultRow {...props} />
                </SearchContext.Provider>,
            );
            cy.contains('Recommended').should('not.exist');
        });
        it('shows tooltip on badge hover', () => {
            const props = setupProps();
            props.creator.account.user_profile.user_id = '25025320';
            testMount(
                // needs some room to show the tooltip
                <div className="m-10 p-10">
                    <SearchContext.Provider
                        value={{ platform: 'instagram', recommendedInfluencers: ['instagram/25025320'] } as any}
                    >
                        <SearchResultRow {...props} />
                    </SearchContext.Provider>
                </div>,
            );

            cy.contains(
                'Are those which have worked with boostbot.ai brands in the past and are known to be open to cooperation',
            ).should('not.be.visible');
            cy.contains('Recommended');
            // .trigger('mouseenter') should work but it doesn't
            cy.get('[data-testid=recommended-badge').click();
            cy.contains(
                'Are those which have worked with boostbot.ai brands in the past and are known to be open to cooperation',
            ).should('be.visible');
        });
    }
});
// Prevent TypeScript from reading file as legacy script
export {};
