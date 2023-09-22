import { deleteDB } from 'idb';
import { numberFormatter } from 'src/utils/formatter';
import { boostbotIntercepts, setupIntercepts } from './intercepts';
import danniCreatorReport from '../../src/mocks/api/creators/report/danni.json';
import boostbotGetInfluencers from '../../src/mocks/api/boostbot/get-influencers.json';

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

    it('can persist chat messages and influencer result states across reloads', () => {
        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains('@DANNIVIVIANI');

        cy.wait(1000); // since IndexedDB is async, wait for it to finish saving state
        cy.reload();

        cy.contains('LED beauty mask');
        cy.contains('@DANNIVIVIANI');
    });

    it('persists finished loading progress messages', () => {
        cy.get('textarea').type('LED beauty mask{enter}');

        const checkExistingLoadingMessage = () => {
            cy.contains('Generating topics and niches');
            cy.contains('Browsing through millions of influencers in our database');
            cy.contains(`I handpicked the ${boostbotGetInfluencers.length * 3} influencers`);
        };

        checkExistingLoadingMessage();

        cy.wait(1000); // since IndexedDB is async, wait for it to finish saving state
        cy.reload();

        checkExistingLoadingMessage();
    });

    it('does not persist unfinished loading progress messages', () => {
        cy.intercept('POST', '/api/boostbot/get-influencers', { body: boostbotGetInfluencers, delay: 2000 });
        cy.intercept('GET', '/api/creators/report*', { body: danniCreatorReport, delay: 2000 });

        cy.get('textarea').type('LED beauty mask{enter}');

        cy.contains('LED beauty mask');
        cy.contains('Generating topics and niches');
        cy.contains('Browsing through millions of influencers in our database');
        cy.contains('Handpicking the best influencers');

        cy.wait(1000); // since IndexedDB is async, wait for it to finish saving state
        cy.reload();

        cy.contains('LED beauty mask');
        cy.contains('Generating topics and niches').should('not.exist');
    });
});

export {};
