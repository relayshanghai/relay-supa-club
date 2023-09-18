import { deleteDB } from 'idb';
import { boostbotIntercepts, setupIntercepts } from './intercepts';

describe('Boostbot', () => {
    beforeEach(() => {
        deleteDB('app-cache');
        setupIntercepts();
        boostbotIntercepts();
    });

    it('can search for a list of influencers and display results', () => {
        cy.loginTestUser();
        cy.visit('/boostbot');

        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains('DANNI VIVIANI');
        cy.contains('@DANNIVIVIANI');
        cy.contains('10K+');
        cy.contains('IG: @therealdanni_v Contact me @ typicalmarie123@gmail.com ***Business Only****');
        cy.contains('#facialhair, #bodyhair, #epilator');
    });
});

export {};
