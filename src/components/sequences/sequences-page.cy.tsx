import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import { SequencesPage } from './sequences-page';
import sequences from 'i18n/en/sequences';
import faq from 'i18n/en/faq';

describe('SequencesPage', () => {
    before(() => {
        worker.start();
    });

    it('Should render the mock sequences in a table', () => {
        testMount(<SequencesPage />);

        cy.contains(sequences.sequences);
        cy.contains(sequences.subtitle);

        cy.contains('tr', 'General collaboration');
        cy.contains('tr', 'Component Test Sequence'); // set in src/mocks/supabase/sequences/all-sequences-by-company.json
    });
    it('opens up FAQ when clicking "Need help?"', () => {
        testMount(<SequencesPage />);

        cy.contains('Need help?').click();
        cy.contains(faq.sequences[0].title);
        cy.contains(faq.sequencesGetMoreInfo);
    });
});
