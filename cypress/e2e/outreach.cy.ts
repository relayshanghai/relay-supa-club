import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';

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
        // TODO
        // cy.contains('Total influencers')
        // cy.contains('Open rate')
        // cy.contains('Reply rate')
        // cy.contains('Bounce rate')

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
        cy.contains('button', 'In sequence').click();
        cy.get('table tbody tr').should('have.length', 2);
        cy.contains('button', 'Ignored').click();
        cy.get('table tbody tr').should('have.length', 1);
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
    });
});
