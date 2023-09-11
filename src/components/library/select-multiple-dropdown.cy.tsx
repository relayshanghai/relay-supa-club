import { testMount } from 'src/utils/cypress-app-wrapper';
import type { CommonStatusType } from './select-multiple-dropdown';
import { SelectMultipleDropdown } from './select-multiple-dropdown';
import { useState } from 'react';

const FilterUsingDropdown = () => {
    const [selectedOptions, setSelectedOptions] = useState<CommonStatusType[]>([]);
    const options = {
        'Option 1': {
            label: 'Option 1',
            value: 10,
            style: 'bg-blue-100 text-blue-500',
        },
        'Option 2': {
            label: 'Option 2',
            style: 'bg-primary-100 text-primary-500',
        },
        'Option 3': {
            label: 'Option 3',
            value: 30,
        },
    };

    return (
        <div className="m-5">
            <SelectMultipleDropdown
                text="sample"
                options={options}
                selectedOptions={selectedOptions}
                setSelectedOptions={(options) => {
                    setSelectedOptions(options);
                }}
                translationPath="manager"
            />
            <table>
                <tr>
                    <th>Data</th>
                </tr>
                {selectedOptions.length === 0
                    ? Object.keys(options).map((option) => {
                          return (
                              <tr key={`option-${option}`}>
                                  <td>{option}</td>
                              </tr>
                          );
                      })
                    : selectedOptions.map((option) => (
                          <tr key={`option-${option}`}>
                              <td>{option}</td>
                          </tr>
                      ))}
            </table>
        </div>
    );
};

describe('test multiple dropdown component', () => {
    it('should filter', () => {
        testMount(<FilterUsingDropdown />);
        cy.contains('tr', 'Option 1');
        cy.contains('tr', 'Option 2');
        cy.contains('tr', 'Option 3');
        cy.contains('sample').click();
        cy.contains('manager.Option 1').click();
        cy.contains('tr', 'Option 1');
        cy.contains('tr', 'Option 2').should('not.exist');
        cy.contains('tr', 'Option 3').should('not.exist');
        cy.contains('Clear Filters').click();
        cy.contains('tr', 'Option 1');
        cy.contains('tr', 'Option 2');
        cy.contains('tr', 'Option 3');
    });
});
