import { setupIntercepts } from './intercepts';
import guidePage from 'i18n/en/guide';

describe('checks restricted to guide page', () => {
    it('check if guide page opens', async () => {
        setupIntercepts();
        cy.loginTestUser();
        cy.contains('Guide').click();
        cy.url().should('include', '/guide');
    });
});

describe('checks restricted to guide page', () => {
    it('check modal functioning for every separate guide', () => {
        setupIntercepts();
        cy.loginTestUser();
        Object.keys(guidePage.modalInfo).forEach((section) => {
            cy.visit('/guide');
            const sectionData = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];
            cy.get('[data-testid="guide-modal-' + section + '"]').click();
            cy.contains(sectionData.sections[0].title);
            cy.contains('Go to ' + sectionData.title).click();
            cy.url().should('not.include', '/guide');
            cy.url().should('include', sectionData.url);
        });
    });
    it('check modal for every separate guide but go back', () => {
        setupIntercepts();
        cy.loginTestUser();
        cy.visit('/guide');
        Object.keys(guidePage.modalInfo).forEach((section) => {
            const sectionData = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];
            cy.get('[data-testid="guide-modal-' + section + '"]').click();
            cy.contains(sectionData.sections[0].title);
            cy.contains(guidePage.goBack).click();
            cy.url().should('include', '/guide');
        });
    });
});

export {};
