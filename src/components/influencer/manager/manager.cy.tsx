import { testMount } from '../../../utils/cypress-app-wrapper';
import { worker } from '../../../mocks/browser';
import manager from 'i18n/en/manager';
import Manager from '.';
import faq from 'i18n/en/faq';

describe('Manager', () => {
    before(() => {
        worker.start();
        cy.intercept('POST', '/api/track*', { status: true });
    });

    it('Should render the managers with the right funnel statuses in a table', () => {
        testMount(<Manager />);

        cy.contains(manager.subtitle);
        cy.contains(manager.title);

        //src/mocks/api/sequence/influencers/sequence-influencers-1
        cy.contains('tr', 'Negotiating Obie Lebeau');
        cy.contains('tr', 'Confirmed Alicia Kim');
        cy.contains('tr', 'Shipped Hermela Solomon');
        cy.contains('tr', 'Rejected FilterLESS_Era');
    });
    it('Should have need help button and can open it', () => {
        testMount(<Manager />);

        cy.contains('Need help?').click({ force: true });
        cy.contains(faq.influencerManager[0].title).click();
        cy.contains(faq.influencerManager[0].detail);
        cy.contains(faq.influencerManagerDescription);
        cy.contains(faq.influencerManagerGetMoreInfo);
    });
});
