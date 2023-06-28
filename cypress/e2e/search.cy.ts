import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';

describe('checks if new search UI and wordcloud are active', () => {
    it('check if guide page opens', async () => {
        await deleteDB('app-cache');
        setupIntercepts();
        cy.visit('/');
        cy.loginTestUser();
        cy.contains('Topic Relevance');
        cy.contains('Add keywords or phrases');
        cy.contains('tiktoker');
        cy.contains('blogger').click();
    });
});


export { };
