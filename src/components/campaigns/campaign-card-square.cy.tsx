import React from 'react';
import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import jimTestCampaign from '../../mocks/supabase/campaigns/jimTestCampaign.json';
import amyTestCampaign from '../../mocks/supabase/campaigns/amyTestCampaign.json';
import newEmptyCampaign from '../../mocks/supabase/campaigns/newEmptyCampaign.json';
import CampaignCardSquare from './CampaignCardSquare';

describe('CampaignCardSquare', () => {
    before(async () => {
        worker.start();
    });

    it('Should render Jim Test Campaign card', () => {
        testMount(<CampaignCardSquare campaign={jimTestCampaign} />);
        cy.contains('To Contact: 4');
        cy.contains('Contacted: 1');
        cy.contains('Confirmed: 1');
        cy.contains('Posted').should('not.exist');
    });

    it('Should render Amy Test Campaign card', () => {
        testMount(<CampaignCardSquare campaign={amyTestCampaign} />);
        cy.contains('To Contact: 5');
        cy.contains('Contacted: 1');
        cy.contains('Confirmed: 2');
        cy.contains('Posted: 1');
    });

    it('Should render New Empty Campaign card', () => {
        testMount(<CampaignCardSquare campaign={newEmptyCampaign} />);
        cy.contains('To Contact').should('not.exist');
        cy.contains('Contacted').should('not.exist');
        cy.contains('Confirmed').should('not.exist');
        cy.contains('Posted').should('not.exist');
    });
});
