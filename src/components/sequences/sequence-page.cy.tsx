import { testMount } from '../../utils/cypress-app-wrapper';
import { worker } from '../../mocks/browser';
import { SequencePage } from './sequence-page';
import faq from 'i18n/en/faq';
import { rest } from 'msw';
import mockInfluencers from 'src/mocks/api/sequence/influencers/sequence-influencers-1';
import type { SequenceSendPostResponse } from 'pages/api/sequence/send';

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
    it('can multi-select influencers and send sequence. Shows error/success toast', () => {
        const mario = mockInfluencers.find((i) => i.name === 'Mario | Marketing & Motivation');
        const josiah = mockInfluencers.find((i) => i.name === 'Josiah');
        const hannah = mockInfluencers.find((i) => i.name === 'hannah cho');
        const mockSendResult: SequenceSendPostResponse = [
            {
                stepNumber: 1,
                sequenceInfluencerId: mario?.id,
            },
            {
                stepNumber: 1,
                sequenceInfluencerId: josiah?.id,
            },
            {
                stepNumber: 1,
                sequenceInfluencerId: hannah?.id,
                error: 'failed to send',
            },
        ];
        worker.use(rest.post('/api/sequence/send', (_req, res, ctx) => res(ctx.status(200), ctx.json(mockSendResult))));

        testMount(<SequencePage {...props} />);
        cy.contains('h1', "Joe's BoostBot Sequence");

        cy.contains('button', 'In sequence').within(() => {
            cy.contains('12');
        });
        cy.contains('button', 'Needs attention').within(() => {
            cy.contains('21');
        });

        cy.contains('button', 'Start selected sequences').should('not.exist');

        cy.contains('tr', mario?.name ?? '').within(() => cy.get('input[type="checkbox"]').click());

        cy.contains('button', 'Start selected sequences').should('exist');

        cy.contains('tr', josiah?.name ?? '').within(() => cy.get('input[type="checkbox"]').click());
        cy.contains('tr', hannah?.name ?? '').within(() => cy.get('input[type="checkbox"]').click());

        cy.contains('button', 'Start selected sequences').click();

        cy.contains('Failed to submit 1 emails to send');
        cy.contains('2 emails successfully scheduled to send');

        // optimistic update works
        cy.contains('button', 'In sequence').within(() => {
            cy.contains('14');
        });
        cy.contains('button', 'Needs attention').within(() => {
            cy.contains('19');
        });
    });
});
