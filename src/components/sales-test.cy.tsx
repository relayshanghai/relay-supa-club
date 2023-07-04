import { testMount } from 'src/utils/cypress-app-wrapper';
import SalesTestComponent from './sales-test';

describe('check if client hooks functioning', () => {
    it('renders', () => {
        testMount(<SalesTestComponent />);
        cy.contains('Add to sales');
        cy.contains('Get from sales');
        cy.contains('0');
    });
    it('adds to sales and gets value', () => {
        testMount(<SalesTestComponent />);
        cy.get('[data-testid="add-sales"]').click();
        cy.get('[data-testid="show-sales"]').contains('0');
        cy.get('[data-testid="get-sales"]').click();
        cy.get('[data-testid="show-sales"]').contains('100');
    });
});
