import React from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import { SearchContext } from '../../hooks/use-search';
import type { CreatorSearchAccountObject } from '../../../types';
import jimTestCampaign from '../../mocks/api/campaigns/jimTestCampaign.json';
import amyTestCampaign from '../../mocks/api/campaigns/amyTestCampaign.json';

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
const campaigns = [jimTestCampaign, amyTestCampaign] as any[];

const setupProps = () => {
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
import { worker } from '../../mocks/browser';
describe('<CreatorPage />', () => {
    before(async () => {
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
    it('shows tooltip on badge hover', () => {
        const props = setupProps();
        props.creator.account.user_profile.user_id = '25025320';
        testMount(
            // needs some room to show the tooltip
            <div className="pt-5">
                <SearchContext.Provider value={{ platform: 'instagram' } as any}>
                    <SearchResultRow {...props} />
                </SearchContext.Provider>
            </div>,
        );
        cy.contains('Recommended');

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
