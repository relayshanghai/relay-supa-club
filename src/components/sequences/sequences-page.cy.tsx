import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import { SequencesPage } from './sequences-page';
import sequences from 'i18n/en/sequences';

describe('SequencesPage', () => {
    before(() => {
        worker.start();
    });

    it('Should render the mock sequences in a table', () => {
        testMount(<SequencesPage />);
        cy.contains('tr', 'General collaboration');
        cy.contains('tr', 'Component Test Sequence'); // set in src/mocks/supabase/sequences/all-sequences-by-company.json

        cy.contains(sequences.subtitle);
    });
});
