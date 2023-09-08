import { testMount } from 'src/utils/cypress-app-wrapper';
import { DeleteSequenceModal } from './modal-delete-sequence';
import sequences from 'i18n/en/sequences';
import { useState } from 'react';

describe('<DeleteSequenceModal />', () => {
    it('modal displays warning and handles delete', async () => {
        const handleDelete = cy.stub();
        const name = 'test sequence';
        const Component = () => {
            const [show, setShow] = useState(true);
            return <DeleteSequenceModal show={show} setShow={setShow} handleDelete={handleDelete} name={name} />;
        };
        testMount(<Component />);

        cy.findByText(`Delete test sequence?`).should('exist');
        cy.findByText(sequences.delete.deleteSequenceDescription).should('exist');
        cy.findByText(sequences.delete.cancel).click();
        cy.findByText(`Delete test sequence?`).should('not.exist');
        cy.findByText(sequences.delete.deleteSequenceDescription).should('not.exist');

        testMount(<Component />);

        cy.findByText(`Delete test sequence?`).should('exist');
        cy.findByText(sequences.delete.deleteSequenceDescription).should('exist');
        cy.findByText(sequences.delete.okaySequence).click();
        cy.findByText(`Delete test sequence?`).should('not.exist');
        cy.findByText(sequences.delete.deleteSequenceDescription)
            .should('not.exist')
            .then(() => {
                expect(handleDelete).to.be.called;
            });
    });
});

export {};
