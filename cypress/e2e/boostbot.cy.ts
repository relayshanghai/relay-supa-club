import { deleteDB } from 'idb';
import { numberFormatter } from 'src/utils/formatter';
import { boostbotIntercepts, setupIntercepts } from './intercepts';
import danniCreatorReport from '../../src/mocks/api/creators/report/danni.json';

describe('Boostbot', () => {
    beforeEach(() => {
        deleteDB('app-cache');
        deleteDB('app-store');
        setupIntercepts();
        boostbotIntercepts();

        cy.loginTestUser();
        cy.visit('/boostbot');
    });

    it('can search for a list of influencers and display results', () => {
        const { fullname, followers } = danniCreatorReport.user_profile;
        const influencerName = fullname;
        const formattedFollowers = String(numberFormatter(followers));

        cy.contains(influencerName).should('not.exist');
        cy.contains(formattedFollowers).should('not.exist');

        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains(influencerName);
        cy.contains(formattedFollowers);
        cy.contains('@DANNIVIVIANI');
        cy.contains('IG: @therealdanni_v Contact me @ typicalmarie123@gmail.com ***Business Only****');
        cy.contains('#facialhair, #bodyhair, #epilator');
    });

    it('can persist chat and influencer result states across reloads', () => {
        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains('@DANNIVIVIANI');

        cy.wait(2000); // since IndexedDB is async, wait for it to finish saving state
        cy.reload();

        cy.contains('LED beauty mask');
        cy.contains('@DANNIVIVIANI');
    });
});

export {};
