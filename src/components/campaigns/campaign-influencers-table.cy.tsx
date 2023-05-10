/// <reference types="@testing-library/cypress" />
// @ts-check

import React from 'react'; // turns out we need this or cypress complains
// 1. on a campaign page, I get a list of influencers. -> campaigns/[id].tsx

import { testMount } from '../../utils/cypress-app-wrapper';
import type { CreatorsOutreachProps } from './campaign-influencers-table';

import CampaignInfluencersTable from './campaign-influencers-table';
import type { CampaignCreatorDB, CampaignDB } from '../../utils/api/db';
import { rest } from 'msw';
import { SUPABASE_URL_CYPRESS, worker } from '../../mocks/browser';
import jimTestCampaign from '../../mocks/supabase/campaigns/jimTestCampaign.json';
import amyTestCampaign from '../../mocks/supabase/campaigns/amyTestCampaign.json';
import newEmptyCampaign from '../../mocks/supabase/campaigns/newEmptyCampaign.json';
import archivedCampaign from '../../mocks/supabase/campaigns/archivedCampaign.json';

import campaignCreatorsJim from '../../mocks/supabase/campaign_creators/campaignCreatorsJimCampaign.json';

const campaigns: CampaignDB[] = [jimTestCampaign, amyTestCampaign, newEmptyCampaign, archivedCampaign];

const currentCampaign = jimTestCampaign;
const currentCreator = campaignCreatorsJim[0] as CampaignCreatorDB;

const campaign2 = amyTestCampaign;
const makeProps = () => {
    // cy.stub can only be called within a test
    const setShowNotesModal = cy.stub();
    const setCurrentCreator = cy.stub();
    const props: CreatorsOutreachProps = {
        currentCampaign,
        setShowNotesModal,
        setCurrentCreator,
        campaigns,
        currentCreator,
    };
    return props;
};

describe('CampaignInfluencersTable', () => {
    before(async () => {
        worker.start();
    });

    it('Should render table of influencers', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('tr').contains(campaignCreatorsJim[0].fullname);
        cy.contains(campaignCreatorsJim[2].fullname);
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

    it.only('Check that a network request is called to the api to add the influencer to destination and delete them from source campaign', async () => {
        worker.use(
            rest.delete(`${SUPABASE_URL_CYPRESS}campaign_creators`, async (req, res, ctx) => {
                const body = (await req.json()) as any;
                cy.log('body', body);
                expect(body.campaignId).to.equal(currentCampaign.id);
                expect(body.id).to.equal(currentCreator.id);

                return res(ctx.delay(500), ctx.json({ success: true }));
            }),
        );
        // Capture the network request to the api for the next test
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('tr').get('button').contains('Move Influencer').click();
        // when this button is clicked, it is not sending the request, cause of a filing nullcheck
        cy.get(`#move-influencer-button-${campaign2.id}`).should('exist').click();
        // when request is done it should have the checkmark icon
        cy.get(`#move-influencer-checkmark-${campaign2.id}`).should('exist');
    });

    // 7. In the target campaign, I see the influencer with all the details preserved from the source campaign. -- this is hard to test in these kind of unit tests because to replicate this we would have to change the list of `campaigns` in the props, and then re-render the component. Basically just testing that the component is re-rendering when the props change. We can test this in an integration test if need be.
});
