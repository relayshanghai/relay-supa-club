import { worker } from 'src/mocks/browser';
import { testMount } from 'src/utils/cypress-app-wrapper';
import CampaignsPage from './campaigns-page';

describe('CampaignsPage', () => {
    before(() => {
        worker.start();
    });

    it('Should render a list of campaign cards', () => {
        testMount(<CampaignsPage companyId="8e6e65ca-dd79-4e68-90e4-9c5462991ae4" />);
        cy.contains('Empty Campaign');
        cy.contains('【test】Amy test campaign for fragrance KOLs');
    });

    it('Should render a list of archived campaign cards', () => {
        testMount(<CampaignsPage companyId="8e6e65ca-dd79-4e68-90e4-9c5462991ae4" />);
        cy.contains('Test Archive Campaign').should('not.exist');
        cy.contains('Archived Campaigns').click();
        cy.contains('Test Archive Campaign');
    });
});
