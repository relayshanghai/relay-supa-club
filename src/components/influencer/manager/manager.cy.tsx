import { testMount } from '../../../utils/cypress-app-wrapper';
import { worker } from '../../../mocks/browser';
import manager from 'i18n/en/manager';
import Manager from '.';

describe('Manager', () => {
    before(() => {
        worker.start();
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
});
