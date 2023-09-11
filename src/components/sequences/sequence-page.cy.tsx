import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import { SequencePage } from './sequence-page';

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
        cy.contains('tr', 'Dirty Tesla'); // Shows a sequence influencer
    });
});
