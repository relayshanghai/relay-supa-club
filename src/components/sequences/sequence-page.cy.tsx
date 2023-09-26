import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import { SequencePage } from './sequence-page';
import faq from 'i18n/en/faq';

describe('<SequencePage />', () => {
    before(() => {
        worker.start();
    });
    const props = {
        sequenceId: 'b7ddd2a8-e114-4423-8cc6-30513c885f07',
    };

    it('Should render the mock sequences in a table', () => {
        testMount(<SequencePage {...props} />);

        cy.contains('h1', "Joe's BoostBot Sequence");
        cy.contains('tr', 'Mario | Marketing & Motivation'); // Shows a sequence influencer
    });
    it('opens up FAQ when clicking "Need help?"', () => {
        testMount(<SequencePage {...props} />);
        cy.contains('Need help?').click();
        cy.contains(faq.sequences[0].title);
        cy.contains(faq.sequencesGetMoreInfo);
    });
    it('shows invalid modal', () => {
        testMount(<SequencePage {...props} />);
        cy.contains('Allegra - No Report');
        cy.getByTestId('send-email-button-allegraalynn-noreport@gmail.com').trigger('mouseover', { force: true });
        cy.contains('Updating influencer report');
    });
});
