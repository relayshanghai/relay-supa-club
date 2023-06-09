/// <reference types="@testing-library/cypress" />
// @ts-check

import { GuideComponent } from './index';

describe('GuideComponent', () => {
    it('should render', () => {
        cy.mount(<GuideComponent title="test title" description="test description" image="agency.svg" />);
        cy.contains('test title');
        cy.contains('test description');
        cy.contains('button', 'Get Started').should('be.visible');
        cy.get('img[alt="Picture of the feature"]');
    });
});
