import { worker } from 'src/mocks/browser';
import { testMount } from 'src/utils/cypress-app-wrapper';
import CampaignsPage from './campaigns-page';

describe('CampaignsPage', () => {
    before(async () => {
        worker.start();
    });

    it('Should render a list of campaign cards', () => {
        cy.wait(3000);

        testMount(<CampaignsPage companyId="8e6e65ca-dd79-4e68-90e4-9c5462991ae4" />);
        cy.get('#campaign-card-second').should('exist');
        cy.get('#campaign-card-【test】amy-test-campaign-for-fragrance-kols').should('exist');

        cy.contains('Empty Campaign');
        cy.contains('【test】Amy test campaign for fragrance KOLs');
    });

    it('Should render a list of archived campaign cards', () => {
        cy.wait(3000);

        testMount(<CampaignsPage companyId="8e6e65ca-dd79-4e68-90e4-9c5462991ae4" />);

        cy.contains('Archived Campaigns').click();

        cy.get('#campaign-card-testcampaign').should('exist');

        cy.contains('Test Archive Campaign');
    });
});
