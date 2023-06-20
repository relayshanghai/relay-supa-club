/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import CreateCompanyButton from './create-company-button';

describe('<CreateCompanyButton />', () => {
    it('Sends Rudderstack event', () => {
        const requestHandler = (req: any) => {
            // @todo create a better stub reply for dataplane call to work
            req.reply({ message: 'ok' });
        };

        cy.mount(<CreateCompanyButton company={'Foo'} onClick={() => null} label={'Click Me'} />);

        cy.intercept('GET', 'https://api.rudderlabs.com/**/*', requestHandler).as('rudderstack-api-call');

        cy.intercept('POST', 'https://relaytechhee.dataplane.rudderstack.com/**/*', requestHandler).as(
            'rudderstack-dataplane-call',
        );

        cy.contains('Click Me').click();

        cy.wait('@rudderstack-api-call');
    });
});

export {};
