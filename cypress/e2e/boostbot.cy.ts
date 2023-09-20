import { deleteDB } from 'idb';
import { numberFormatter } from 'src/utils/formatter';
import { boostbotIntercepts, setupIntercepts } from './intercepts';
import danniCreatorReport from '../../src/mocks/api/creators/report/danni.json';

describe('Boostbot', () => {
    beforeEach(() => {
        deleteDB('app-cache');
        setupIntercepts();
        boostbotIntercepts();
    });

    it('can search for a list of influencers and display results', () => {
        cy.loginTestUser();
        cy.visit('/boostbot');

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
});

export {};
