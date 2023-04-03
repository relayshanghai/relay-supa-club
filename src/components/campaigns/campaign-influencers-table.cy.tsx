import React from 'react'; // turns out we need this or cypress complains
// 1. on a campaign page, I get a list of influencers. -> campaigns/[id].tsx

import { testMount } from '../../utils/cypress-app-wrapper';
import type { CreatorsOutreachProps } from './campaign-influencers-table';
import type { CampaignCreatorAddCreatorPostBody } from '../../../pages/api/campaigns/add-creator';
import type { CampaignCreatorsDeleteBody } from '../../../pages/api/campaigns/delete-creator';

import CampaignInfluencersTable from './campaign-influencers-table';
import type {
    CampaignCreatorDB,
    CampaignDB,
    CampaignWithCompanyCreators,
} from '../../utils/api/db';
import { rest } from 'msw';
import { APP_URL_CYPRESS, worker } from '../../mocks/browser';

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
    date_start_campaign: '2023-02-20T00:00:00+00:00',
    date_end_campaign: '2023-02-24T00:00:00+00:00',
    slug: 'jim-test-campaign-february-2023',
    product_name: "JIm's Bug Tester",
    tag_list: ['pets'],
    promo_types: ['Dedicated Video', 'Integrated Video'],
    target_locations: ['United States of America'],
    media: [{}],
    purge_media: [],
};
const creator1: CampaignCreatorDB = {
    id: 'creator1',
    created_at: '2023-02-12T03:01:51.468377+00:00',
    status: 'to contact',
    campaign_id: 'campaign1',
    rate_cents: 0,
    rate_currency: 'USD',
    payment_status: "'unpaid'::text",
    paid_amount_cents: 0,
    paid_amount_currency: 'USD',
    sample_status: "'unsent'::text",
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
    it('Should open a modal when i click "Move Influencer" button. The modal should have a title of "Move To Campaign" and subtitle "Move this influencer to an existing campaign". Should include a list of campaigns  When I click on the move button inside a campaign row I get a loading spinner', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);

        cy.contains('Move To Campaign').should('not.exist');

        cy.contains('Move this influencer to an existing campaign').should('not.exist');
        cy.get(`#move-influencer-button-${campaign2.id}`).should('not.exist');

        cy.get('tr').get('button').contains('Move Influencer').click();

        cy.contains('Move To Campaign');
        cy.contains('Move this influencer to an existing campaign');
        cy.get(`#move-influencer-spinner-${campaign2.id}`).should('not.exist');

        cy.get(`#move-influencer-button-${campaign2.id}`).click();

        // shows a loading spinner
        cy.get(`#move-influencer-spinner-${campaign2.id}`);
    });

    it('Check that a network request is called to the api to add the influencer to destination and delete them from source campaign', async () => {
        worker.use(
            rest.post(`${APP_URL_CYPRESS}/api/campaigns/add-creator`, async (req, res, ctx) => {
                const body = (await req.json()) as CampaignCreatorAddCreatorPostBody;

                expect(body.campaign_id).to.equal(campaign2.id);

                // add a bit of delay to get the loading spinner to show
                return res(ctx.delay(500), ctx.json({ success: true }));
            }),
            rest.delete(
                `${APP_URL_CYPRESS}/api/campaigns/delete-creator`,
                async (req, res, ctx) => {
                    const body = (await req.json()) as CampaignCreatorsDeleteBody;

                    expect(body.campaignId).to.equal(campaign1.id);
                    expect(body.id).to.equal(creator1.id);

                    return res(ctx.delay(500), ctx.json({ success: true }));
                },
            ),
            // for the default msw handlers, we'll use more realistic data. For individual component tests we can pass in specific mocks with names like 'campaign1' instead of a real one. This makes the tests more readable and makes it easy to test different scenarios.
            rest.get(`${APP_URL_CYPRESS}/api/campaigns`, (req, res, ctx) => {
                // we might want to investigate where in the children components this is being queried from, because this should just match the campaigns prop
                // I think it is because `useCampaigns` is in `MoveInfluencerModalCard`
                return res(ctx.json(campaigns));
            }),
        );
        worker.start();
        // Capture the network request to the api for the next test
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('tr').get('button').contains('Move Influencer').click();
        // when this button is clicked, it is not sending the request, cause of a filing nullcheck
        cy.get(`#move-influencer-button-${campaign2.id}`).click();
        // when request is done it should have the checkmark icon
        cy.get(`#move-influencer-checkmark-${campaign2.id}`);
    });

    // 7. In the target campaign, I see the influencer with all the details preserved from the source campaign. -- this is hard to test in these kind of unit tests because to replicate this we would have to change the list of `campaigns` in the props, and then re-render the component. Basically just testing that the component is re-rendering when the props change. We can test this in an integration test if need be.
});
