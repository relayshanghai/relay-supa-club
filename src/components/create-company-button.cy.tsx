/// <reference types="@testing-library/cypress" />
// @ts-check
import React from 'react';
import CreateCompanyButton from './create-company-button';
import RudderstackProvider from './rudderstack/rudderstack-provider';

describe('<CreateCompanyButton />', () => {
    it('Sends Rudderstack event', () => {
        const requestHandler = (req: any) => {
            req.reply({ message: 'ok' });
        };

        cy.intercept('GET', 'https://api.rudderlabs.com/sourceConfig/*', requestHandler).as('rudderstack-api-call');

        cy.mount(
            <RudderstackProvider>
                <CreateCompanyButton company={'Foo'} onClick={() => null} label={'Click Me'} />
            </RudderstackProvider>,
        );

        // cy.intercept('GET', '/api/test*', requestHandler).as('rudderstack-api-call');
        // cy.intercept('GET', 'https://enyfsw7kkcou.x.pipedream.net/', requestHandler).as('rudderstack-api-call');

        // cy.intercept('POST', 'https://relaytechhee.dataplane.rudderstack.com/**/*', requestHandler).as(
        //     'rudderstack-dataplane-call',
        // );

        const opts = {
            log: true,
            timeout: 60000,
        };

        cy.contains('Click Me', opts).click(opts);

        cy.wait('@rudderstack-api-call', opts);
    });
});

export {};
