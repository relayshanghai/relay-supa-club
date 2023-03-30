import React from 'react'; // turns out we need this or cypress complains
// 1. on a campaign page, I get a list of influencers. -> campaigns/[id].tsx

import { testMount } from '../../utils/cypress-app-wrapper';
import type { CreatorsOutreachProps } from './campaign-influencers-table';
import CampaignInfluencersTable from './campaign-influencers-table';
import type {
    CampaignCreatorDB,
    CampaignDB,
    CampaignWithCompanyCreators,
} from '../../utils/api/db';
import { rest } from 'msw';
import { APP_URL_CYPRESS } from '../../mocks/browser';

const currentCampaign: CampaignDB = {
    id: 'campaign1',
    created_at: '2023-02-12T02:52:44.285648+00:00',
    name: 'Campaign 1',
    description: 'test campaign 1.',
    company_id: 'company1',
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
};
const creator1: CampaignCreatorDB = {
    id: 'creator1',
    created_at: '2023-02-12T03:01:51.468377+00:00',
    status: 'to contact',
    campaign_id: 'campaign1',
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
    avatar_url: '',
    username: null,
    fullname: 'Creator1 name',
    link_url: 'https://www.youtube.com/channel/UCJQjhL019_F0nckUU88JAJA',
    creator_id: 'UCJQjhL019_F0nckUU88JAJA',
    platform: 'youtube',
    added_by_id: '9bfbc685-2881-47ac-b75a-c7e210f187f2',
};
const creator2: CampaignCreatorDB = {
    ...creator1,
    id: 'creator2',
    fullname: 'Creator2 name',
};
const creator3: CampaignCreatorDB = {
    ...creator1,
    id: 'creator3',
    fullname: 'Creator3 name',
};

const campaignCreators: CampaignCreatorDB[] = [creator1, creator2, creator3];
const company = {
    id: 'company1',
    name: 'Company 1',
    cus_id: 'cus_1',
};
const companies: any = [company]; // weird typescript compile bug
const campaign1: CampaignWithCompanyCreators = {
    ...currentCampaign,
    companies,
    campaign_creators: campaignCreators,
};

/** Campaign 2 has no influencers */
const campaign2: CampaignWithCompanyCreators = {
    ...campaign1,
    id: 'campaign2',
    name: 'Campaign 2',
    campaign_creators: [],
};

const campaigns: CampaignWithCompanyCreators[] = [campaign1, campaign2];
const makeProps = () => {
    // cy.stub can only be called within a test
    const setShowNotesModal = cy.stub();
    const setCurrentCreator = cy.stub();
    const props: CreatorsOutreachProps = {
        currentCampaign: campaign1,
        setShowNotesModal,
        setCurrentCreator,
        campaigns,
        currentCreator: creator1,
    };
    return props;
};

describe('CampaignInfluencersTable', () => {
    before(async () => {
        const { worker } = await import('../../mocks/browser');
        worker.use(
            // for the default msw handlers, we'll use more realistic data. For individual component tests we can pass in specific mocks with names like 'campaign1' instead of a real one. This makes the tests more readable and makes it easy to test different scenarios.
            rest.get(`${APP_URL_CYPRESS}/api/campaigns`, (req, res, ctx) => {
                // we might want to investigate where in the children components this is being queried from, because this should just match the campaigns prop
                // I think it is because `useCampaigns` is in `MoveInfluencerModalCard`
                return res(ctx.json(campaigns));
            }),
        );
        worker.start();
    });

    it('Should render table of influencers', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('tr').contains('Creator1 name');
        cy.contains('Creator2 name');
        cy.contains('Creator3 name');
    });
    it('Should display an influencer table row where I can see a button called "Move Influencer"', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('tr').get('button').contains('Move Influencer');
    });
    it('Should open a modal with a list of campaigns when i click "Move Influencer" button. When I click on the move button inside a campaign row I get a loading spinner', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('tr').get('button').contains('Move Influencer').click();

        // modal appears
        // check for the text 'Add this influencer to your existing campaigns'
        cy.contains('Add this influencer to your existing campaigns');
        // Might need to put a data-testid on the button cause its hard to select.
        cy.get(`#move-influencer-button-${campaign2.id}`).click().wait(1000);
        cy.get(`#move-influencer-spinner-${campaign2.id}`);
        // you might need a data-testid on the spinner too.
    });
    it('Check that a network request is made to the api to add the influencer is called', () => {
        const requestUrl = `${APP_URL_CYPRESS}/api/campaigns/add-creator`;
        cy.intercept('POST', requestUrl).as('add-creator-api-request');

        cy.wait('@add-creator-api-request').then((interception) => {
            // assert that the network request was made
            expect(interception.request.method).to.eq('POST');
            expect(interception.request.url).to.eq(requestUrl);

            // assert that the request body matches what you want
            expect(interception.request.body).to.deep.eq({
                campaign_id: campaign2.id,
                creator_id: creator1.creator_id,
            });
        });
    });

    // 6. In the source campaign, I don't see the influencer anymore.
    // So this is accomplished by calling the api to remove the influencer. we don't need to test that implementation, we just need to check that that function was called, and that if we rerender the component with the influencer removed, it is no longer in the UI.
    it('Should remove the influencer from the source campaign when I click the move button in the modal', () => {
        // still looking into whether we need to stub the `useCampaigns` hook, or whether we should just use `cy.intercept` to confirm the api call was made.
        // https://blog.zenika.com/2022/10/07/a-few-ways-to-approach-cypress-component-testing-with-react-components/
    });

    // 7. In the target campaign, I see the influencer with all the details preserved from the source campaign.
});
