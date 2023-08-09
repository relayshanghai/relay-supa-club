import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';
import { columnsIgnored, columnsInSequence, columnsNeedsAttention } from 'src/components/sequences/constants';
import sequences from 'i18n/en/sequences';

describe('outreach', () => {
    beforeEach(() => {
        deleteDB('app-cache');
        setupIntercepts();
        cy.visit('/');
        cy.loginTestUser();
    });
    it('sequence page', () => {
        cy.contains('Sequences').click();

        // Sequence title row
        // cy.contains('General collaboration');
        cy.contains('Auto-start', { timeout: 10000 });
        cy.contains('button', 'Update template variables');

        // stats
        cy.getByTestId('stat-card-total influencers').within(() => {
            cy.contains('Total influencers');
            cy.contains('6');
        });
        cy.getByTestId('stat-card-open rate').within(() => {
            cy.contains('Open rate');
            cy.contains('33%');
        });
        cy.getByTestId('stat-card-reply rate').within(() => {
            cy.contains('Reply rate');
            cy.contains('17%');
        });
        cy.getByTestId('stat-card-bounce rate').within(() => {
            cy.contains('Bounce rate');
            cy.contains('17%');
        });

        // tabs
        cy.contains('button', 'Needs attention').within(() => {
            cy.contains('3');
        });
        cy.contains('button', 'In sequence').within(() => {
            cy.contains('2');
        });
        cy.contains('button', 'Ignored').within(() => {
            cy.contains('1');
        });

        cy.get('table tbody tr').should('have.length', 3); // table has three rows
        // has all columns
        columnsNeedsAttention.forEach((column) => {
            cy.contains(sequences.columns[column]);
        });
        cy.contains('button', 'In sequence').click();
        cy.get('table tbody tr').should('have.length', 2);
        columnsInSequence.forEach((column) => {
            cy.contains(sequences.columns[column]);
        });
        cy.contains('button', 'Ignored').click();
        cy.get('table tbody tr').should('have.length', 1);
        columnsIgnored.forEach((column) => {
            cy.contains(sequences.columns[column]);
        });
        cy.contains('button', 'Needs attention').click();
        cy.get('table tbody tr').should('have.length', 3);

        // influencers are in order of Date added, Bob, Alice, then Charlie
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.contains('Bob-Recommended Brown');
            });
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.contains('Alice Anderson');
            });
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.contains('Charlie Charles');
            });

        // can edit email
        cy.contains('Add email').should('not.exist');
        cy.contains('alice.anderson@example.com').click();
        cy.getByTestId('table-inline-input-add email').clear();
        cy.get('button[type=submit]').click();
        cy.contains('Add email').should('exist').click();
        cy.getByTestId('table-inline-input-add email').type('new-email@example.com');
        cy.get('button[type=submit]').click();
        cy.contains('Add email').should('not.exist');
        cy.contains('new-email@example.com').click();
        cy.getByTestId('table-inline-input-add email').clear().type('alice.anderson@example.com'); // reset so you can run the test again if need be
        cy.get('button[type=submit]').click();
    });
});
