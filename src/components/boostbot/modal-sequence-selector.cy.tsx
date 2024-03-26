import { testMount } from '../../utils/cypress-app-wrapper';
import { ModalSequenceSelector } from 'src/components/boostbot/modal-sequence-selector';
import type { Sequence } from 'src/utils/api/db';

describe('ModalSequenceSelector', () => {
    it('handles sequence selection', () => {
        const sequences: Sequence[] = [
            {
                id: '1',
                name: 'Sequence 1',
                auto_start: false,
                company_id: 'company1',
                created_at: '2022-01-01',
                deleted: false,
                manager_first_name: null,
                manager_id: null,
                updated_at: '2022-01-01',
                product_id: 'product_1',
            },
            {
                id: '2',
                name: 'Sequence 2',
                auto_start: true,
                company_id: 'company2',
                created_at: '2022-01-01',
                deleted: false,
                manager_first_name: null,
                manager_id: null,
                updated_at: '2022-01-01',
                product_id: 'product_1',
            },
        ];

        const setShow = cy.stub();
        const handleAddToSequence = cy.stub();
        const setSequence = cy.stub();
        testMount(
            <ModalSequenceSelector
                show={true}
                setShow={setShow}
                sequence={sequences[0]}
                setSequence={setSequence}
                sequences={sequences}
                handleAddToSequence={handleAddToSequence}
            />,
        );

        cy.get('[data-testid="sequence-dropdown"]').select('Sequence 2');
        expect(setShow.calledOnceWith(false));
        expect(setSequence.calledOnceWith(sequences[1]));
        expect(handleAddToSequence.calledOnce);
    });
});
