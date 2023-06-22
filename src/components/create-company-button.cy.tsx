/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import CreateCompanyButton, { CreateCompanyEvent } from './create-company-button';

describe('<CreateCompanyButton />', () => {
    it('Sends Rudderstack event', () => {
        const requestHandler = (req: any) => {
            req.reply({ message: 'ok' });
        };

        cy.intercept('GET', 'https://api.rudderlabs.com/sourceConfig/*', requestHandler).as('rudderstack-api-call');

        // cy.intercept('POST', 'https://relaytechhee.dataplane.rudderstack.com/**/*', requestHandler).as(
        //     'rudderstack-dataplane-call',
        // );

        cy.mount(
            <CreateCompanyButton event={CreateCompanyEvent} eventpayload={{ company: 'Foo' }}>
                Click Me
            </CreateCompanyButton>,
        );

        const opts = {
            log: true,
            timeout: 60000,
        };

        cy.contains('Click Me', opts).click(opts);

        cy.wait('@rudderstack-api-call', opts);
        // cy.wait('@rudderstack-dataplane-call', opts);
    });
});

export {};
