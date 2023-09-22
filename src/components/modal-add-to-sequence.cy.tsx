import { testMount } from 'src/utils/cypress-app-wrapper';
import { AddToSequenceModal } from './modal-add-to-sequence';
import creators from 'i18n/en/creators';
import { useState } from 'react';
import { worker } from 'src/mocks/browser';
import type { CreatorUserProfile } from 'types';
import mockSequences from 'src/mocks/supabase/sequences/all-sequences-by-company.json';

describe('<AddToSequenceModal />', () => {
    before(() => {
        worker.start();
    });
    it('modal displays list of sequences to choose from', async () => {
        const Component = () => {
            const [show, setShow] = useState(true);
            return (
                <AddToSequenceModal
                    show={show}
                    setShow={setShow}
                    creatorProfile={{ user_id: '123' } as CreatorUserProfile}
                    platform="youtube"
                    setSuppressReportFetch={() => undefined}
                    sequence={null}
                    setSequence={() => undefined}
                    setSequenceInfluencer={() => undefined}
                    sequences={mockSequences}
                />
            );
        };
        testMount(<Component />);
        const testSequenceName = "Joe's BoostBot Sequence"; // set in src/mocks/supabase/sequences/all-sequences-by-company.json
        cy.contains('Add to sequence');
        cy.get('select option:selected').should('have.text', 'General collaboration');
        cy.get('select').select(testSequenceName);
        cy.get('select option:selected').should('have.text', testSequenceName);
    });
    it('shows warning text', () => {
        const Component = () => {
            const [show, setShow] = useState(true);
            return (
                <AddToSequenceModal
                    show={show}
                    setShow={setShow}
                    creatorProfile={{ user_id: '123' } as CreatorUserProfile}
                    platform="youtube"
                    setSuppressReportFetch={() => undefined}
                    sequence={null}
                    setSequence={() => undefined}
                    setSequenceInfluencer={() => undefined}
                    sequences={mockSequences}
                />
            );
        };
        testMount(<Component />);
        cy.wait(1000); // Adding this wait as subsequent tests were failing
        cy.contains(creators.addToSequenceNotes);
        cy.contains(creators.addToSequenceNotes2);
        cy.contains(creators.recommendedTooltip);
    });
});

export {};
