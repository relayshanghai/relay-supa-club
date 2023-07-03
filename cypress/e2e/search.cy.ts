import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';

describe('test setting keywords', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
    })
    it('check if setting a keyword works', async () => {
        setupIntercepts();
        cy.visit('/');
        cy.loginTestUser();
        cy.contains('Cocomelon');
        cy.get('input[data-testid="input-keywords"]').type('eminence in shadow{enter}');
        cy.get('button[data-testid="search-button"]').click();
        cy.contains('Cocomelon').should('not.exist');
        cy.contains('@Amstron9');
        cy.get('span[data-testid="remove-keyword-gaming"]').click();
        cy.contains('button', 'Search').click();
        cy.contains('@Amstron9').should('not.exist');
    });
})


export { };
