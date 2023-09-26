import { worker } from 'src/mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import CampaignsPage from './campaigns-page';

describe('CampaignsPage', () => {
    before(() => {
        worker.start();
    });

    it.skip('Should render a list of campaign cards', () => {
        testMount(<CampaignsPage />);
        cy.contains('Empty Campaign');
        cy.contains('【test】Amy test campaign for fragrance KOLs');
    });

    it.skip('Should render a list of archived campaign cards', () => {
        testMount(<CampaignsPage />);
        cy.contains('Test Archive Campaign').should('not.exist');
        cy.contains('Archived Campaigns').click();
        cy.contains('Test Archive Campaign');
    });
});
