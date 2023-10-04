import { deleteDB } from 'idb';
import { reinsertAlice, reinsertCharlie, resetBobsStatus, resetSequenceEmails } from './helpers';
import { setupIntercepts } from './intercepts';

const resetData = async () => {
    await deleteDB('app-cache');

    await reinsertAlice();
    await resetBobsStatus();
    await reinsertCharlie(); // reinsert so you can run again easily
    await resetSequenceEmails();
};

describe('outreach', () => {
    beforeEach(() => {
        new Cypress.Promise(resetData);
        // turn back on the real database sequence calls
        setupIntercepts({ useRealSequences: true });

        cy.loginTestUser();
    });
    it('can create new sequences. Can delete sequences', () => {
        cy.contains('Sequences').click();
        cy.contains('New sequence', { timeout: 10000 }).click();
        cy.get('input[placeholder="Enter a name for your sequence"]').type('New Sequence Test');
        cy.contains('button', 'Create new sequence').click();
        cy.contains('a', 'New Sequence Test').click({ timeout: 10000 });
        cy.contains('tr', 'View sequence templates').should('not.exist');
        cy.contains('button', 'View sequence templates').click({ timeout: 10000 });
        cy.get('input[id="template-variable-input-productName"]').clear().type('Test Product');
        cy.contains('button', 'Update variables').click();
        cy.contains(
            'The values you see here are what will be used to automatically customize the actual email content of your sequence emails!',
        ).should('not.exist');
        cy.contains('Template variables updated');
        cy.contains('Sequences').click();
        cy.contains('tr', 'New Sequence Test').contains('Test Product');
        //  create another dummy sequence to show multi-delete works
        cy.contains('New sequence').click();
        cy.get('input[placeholder="Enter a name for your sequence"]').type('New Sequence Test 2');
        cy.contains('button', 'Create new sequence').click();
        cy.contains('a', 'New Sequence Test 2');
        // cleanup and test delete
        cy.getByTestId('delete-sequences-button').should('not.be.visible');
        cy.getByTestId('sequences-select-all').should('not.be.checked');
        cy.getByTestId('sequences-select-all').check();
        cy.getByTestId('sequence-checkbox').eq(0).should('be.checked');
        cy.getByTestId('sequence-checkbox').eq(1).should('be.checked');
        cy.getByTestId('sequence-checkbox').eq(2).should('be.checked');
        cy.getByTestId('sequence-checkbox').eq(0).uncheck();
        cy.getByTestId('sequences-select-all').should('not.be.checked');
        cy.getByTestId('delete-sequences-button').click();
        cy.contains('button', 'Yes. Delete this sequence').click();
        cy.contains('tr', 'New Sequence Test').should('not.exist');
        cy.contains('tr', 'New Sequence Test 2').should('not.exist');
    });
});
