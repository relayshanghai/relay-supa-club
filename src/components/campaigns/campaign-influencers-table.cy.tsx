/// <reference types="@testing-library/cypress" />
// @ts-check

import React from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import type { CreatorsOutreachProps } from './campaign-influencers-table';
import type { CampaignCreatorDB, CampaignDB } from '../../utils/api/db';
import { rest } from 'msw';
import { SUPABASE_URL_CYPRESS, worker } from '../../mocks/browser';
import jimTestCampaign from '../../mocks/supabase/campaigns/jimTestCampaign.json';
import amyTestCampaign from '../../mocks/supabase/campaigns/amyTestCampaign.json';
import newEmptyCampaign from '../../mocks/supabase/campaigns/newEmptyCampaign.json';
import archivedCampaign from '../../mocks/supabase/campaigns/archivedCampaign.json';
import campaignCreatorsJim from '../../mocks/supabase/campaign_creators/campaignCreatorsJimCampaign.json';
import CampaignInfluencersTable from './campaign-influencers-table';

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
        cy.intercept('POST', '/api/track*', { status: true });
        await worker.start();
    });

    it('Should render table of influencers', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('tr').contains(campaignCreatorsJim[0].fullname);
        cy.contains(campaignCreatorsJim[2].fullname);
    });
    it('should default toContact tab that shows contact and status column', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('div').contains('To Contact').should('have.class', 'text-primary-500');
        cy.contains('Contact');
        cy.contains('Status');
    });

    it('should show status column when switched to Contacted tab', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.contains('Contacted').click();
        cy.get('div').contains('Contacted').should('have.class', 'text-primary-500');
        cy.contains('Status');
        cy.contains('View Contact Info').should('not.exist'); // prevent falsy truth, should not show contact column
    });

    it('should show status, next action and influencer fee columns when switched to inProgress tab', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.contains('In Progress').click();
        cy.get('div').contains('In Progress').should('have.class', 'text-primary-500');
        cy.contains('Status');
        cy.contains('Next Action Point');
        cy.contains('Influencer Fee');
    });

    it('should show status, next action and influencer fee columns when switched to Confirmed tab', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.contains('Confirmed').click();
        cy.get('div').contains('Confirmed').should('have.class', 'text-primary-500');
        cy.contains('Status');
        cy.contains('Next Action Point');
        cy.contains('Influencer Fee');
    });

    it('should show status, next action, influencer fee and links columns when switched Posted tab', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.contains('Posted').click();
        cy.get('div').contains('Posted').should('have.class', 'text-primary-500');
        cy.contains('Status');
        cy.contains('Next Action Point');
        cy.contains('Influencer Fee');
        cy.contains('Links');
    });

    it('Should display an influencer table row where I can see a button for "Move Influencer"', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.get('[data-testid="move-influencer-button"]').should('exist');
    });

    it('Should open a modal when i click "Move Influencer" button. The modal should have a title of "Move To Campaign" and subtitle "Move this influencer to an existing campaign". Should include a list of campaigns  When I click on the move button inside a campaign row I get a loading spinner', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);

        cy.contains('Move To Campaign').should('not.exist');

        cy.contains('Move this influencer to an existing campaign').should('not.exist');
        cy.get(`#move-influencer-button-${campaign2.id}`).should('not.exist');

        cy.get('[data-testid="move-influencer-button"]').eq(0).click(); //click the move icon on the first row
        cy.contains('Move To Campaign');
        cy.contains('Move this influencer to an existing campaign');
        cy.get(`#move-influencer-spinner-${campaign2.id}`).should('not.exist');

        cy.get(`#move-influencer-button-${campaign2.id}`).click();

        // shows a loading spinner
        cy.get(`#move-influencer-spinner-${campaign2.id}`);
    });

    it('Check that a network request is called to the api to add the influencer to destination and delete them from source campaign', async () => {
        cy.on('uncaught:exception', () => {
            // returning false here prevents Cypress from
            // failing the test
            return false;
        });
        worker.use(
            rest.delete(`${SUPABASE_URL_CYPRESS}/campaign_creators`, async (req, res, ctx) => {
                const queries = req.url.searchParams;
                const campaignId = queries.get('campaign_id')?.split('eq.')[1];
                const influencerId = queries.get('id')?.split('eq.')[1];
                expect(campaignId).to.equal(currentCampaign.id);
                expect(influencerId).to.equal(currentCreator.id);

                return res(ctx.delay(500), ctx.json({ success: true }));
            }),
            rest.post(`${SUPABASE_URL_CYPRESS}/campaign_creators`, (_req, res, ctx) => {
                return res(ctx.delay(500), ctx.json(currentCreator));
            }),
        );
        // Capture the network request to the api for the next test
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.contains('tr', currentCreator.fullname ?? '').within(() => cy.getByTestId('move-influencer-button').click());
        // when this button is clicked, it is not sending the request, cause of a filing nullcheck
        cy.get(`#move-influencer-button-${campaign2.id}`).should('exist').click();
        // when request is done it should have the checkmark icon
        cy.get(`#move-influencer-checkmark-${campaign2.id}`).should('exist');
    });

    // 7. In the target campaign, I see the influencer with all the details preserved from the source campaign. -- this is hard to test in these kind of unit tests because to replicate this we would have to change the list of `campaigns` in the props, and then re-render the component. Basically just testing that the component is re-rendering when the props change. We can test this in an integration test if need be.

    it('shows the manage influencer modal when the manage button is clicked', () => {
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.contains('Manage Influencer').should('not.exist');
        cy.get('tr').get('[data-testid="manage-button"]').first().click();
        cy.contains('Manage Influencer');
    });
    it('shows the add posts modal when the "Content" button is clicked', () => {
        cy.on('uncaught:exception', () => {
            // returning false here prevents Cypress from
            // failing the test
            return false;
        });
        testMount(<CampaignInfluencersTable {...makeProps()} />);
        cy.contains('Manage Posts').should('not.exist');
        cy.contains('Posted 1').click();
        cy.contains('button', 'Content').click();
        cy.contains('Manage Posts');
    });
});
