import { testMount } from 'src/utils/cypress-app-wrapper';
import SalesTestComponent from './sales-test';

const companyID = 'ee6e9a71-69a9-41e4-aba6-85c1516ac233';
const campaignID = '64056a7a-f044-4bc0-89c0-159fb5a16ae6';

// Test will only run if the company does not have any pre-existing sales
describe('check if client hooks functioning', () => {
    it('renders', () => {
        testMount(<SalesTestComponent companyID={companyID} campaignID={campaignID} amount={100} />);
        cy.contains('Add to sales');
        cy.contains('Get from sales');
        cy.contains('0');
    });
    it('adds to sales and gets value', () => {
        testMount(<SalesTestComponent companyID={companyID} campaignID={campaignID} amount={100} />);
        cy.get('[data-testid="add-sales"]').click();
        cy.get('[data-testid="show-sales"]').contains('0');
        cy.get('[data-testid="get-sales"]').click();
        cy.get('[data-testid="show-sales"]').contains('100');
    });
});
