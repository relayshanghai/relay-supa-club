import { worker } from 'src/mocks/browser';
import { testMount } from '../../utils/cypress-app-wrapper';
import CampaignsPage from './campaigns-page';
import { CompanyProvider } from 'src/hooks/use-company';

describe('CampaignsPage', () => {
    before(() => {
        worker.start();
    });

    it('Should render a list of campaign cards', () => {
        testMount(
            <CompanyProvider>
                <CampaignsPage />
            </CompanyProvider>,
        );
        cy.contains('Empty Campaign');
        cy.contains('【test】Amy test campaign for fragrance KOLs');
    });

    it('Should render a list of archived campaign cards', () => {
        testMount(
            <CompanyProvider>
                <CampaignsPage />
            </CompanyProvider>,
        );
        cy.contains('Test Archive Campaign').should('not.exist');
        cy.contains('Archived Campaigns').click();
        cy.contains('Test Archive Campaign');
    });
});
