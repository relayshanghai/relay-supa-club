/// <reference types="@testing-library/cypress" />
// @ts-check

import { GuideComponent } from './index';

describe('GuideComponent', () => {
    it('should render', () => {
        cy.mount(<GuideComponent />);
        cy.contains('Welcome');
    });
});
