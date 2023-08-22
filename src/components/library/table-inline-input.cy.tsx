/// <reference types="@testing-library/cypress" />
// @ts-check
import { testMount } from '../../utils/cypress-app-wrapper';
import { TableInlineInput } from './table-inline-input';

import { useState } from 'react';

describe('TableInlineInput', () => {
    it('should allow editing', () => {
        const updateMock = cy.stub();
        const Component = () => {
            const [value, setValue] = useState('');

            const handleUpdateWithMock = async (val: string) => {
                await updateMock(val);
                await setValue(val);
            };
            return (
                <TableInlineInput
                    value={value}
                    textPromptForMissingValue="text-prompt"
                    onSubmit={handleUpdateWithMock}
                />
            );
        };
        testMount(<Component />);

        // shows the value as a button not an input
        cy.getByTestId('table-inline-input-text-prompt').should('not.exist');
        cy.contains('button', 'text-prompt').click();
        cy.getByTestId('table-inline-input-text-prompt');
        cy.get('input').clear().type('test-input-2');
        cy.get('button[type=submit]').click();
        cy.getByTestId('table-inline-input-text-prompt').should('not.exist');
        cy.contains('button', 'test-input-2');
        cy.contains('button', 'test-input-2').then(() => {
            expect(updateMock).to.be.calledWith('test-input-2'); // if not wrapped in .then, this gets checked before the updateMock is called
        });

        // cancel button
        cy.contains('button', 'test-input-2').click();
        cy.get('input').clear().type('test-input-3');
        cy.getByTestId('table-inline-input-cancel').click();
        cy.contains('button', 'test-input-2');
        cy.contains('button', 'test-input-3')
            .should('not.exist')
            .then(() => {
                expect(updateMock).to.be.calledOnce;
            });
    });
});
