import { deleteDB } from 'idb';
import { setupIntercepts } from './intercepts';
import guidePage from 'i18n/en/guide';

describe('checks restricted to guide page', () => {
    it('check if guide page opens', async () => {
        await deleteDB('app-cache');
        setupIntercepts(); // some will be overriden
        cy.visit('/');
        cy.loginTestUser();
        cy.contains('Guide').click();
        cy.url().should('include', '/guide');
    });
});

describe('checks restricted to guide page', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
        
    });
    it('check modal functioning for every separate guide', () => {
        setupIntercepts(); // some will be overriden
        cy.visit('/login');
        cy.loginTestUser();
        Object.keys(guidePage.modalInfo).forEach((section) => {
            cy.visit('/guide');
            const sectionData = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];
            cy.get('[data-testid="guide-modal-' + section + '"]').click();
            cy.contains(sectionData.title);
            cy.contains(sectionData.subtitle);
            cy.contains(sectionData.description);
            cy.contains('Go to ' + sectionData.title).click();
            cy.url().should('not.include', '/guide');
            cy.url().should('include', sectionData.url);
        })
    });
    it('check modal for every separate guide but go back', () => {
        setupIntercepts(); // some will be overriden
        cy.visit('/login');
        cy.loginTestUser();
        cy.visit('/guide');
        Object.keys(guidePage.modalInfo).forEach((section) => {
            const sectionData = guidePage.modalInfo[section as keyof typeof guidePage.modalInfo];
            cy.get('[data-testid="guide-modal-' + section + '"]').click();
            cy.contains(sectionData.title);
            cy.contains(sectionData.subtitle);
            cy.contains(sectionData.description);
            cy.contains(guidePage.goBack).click();
            cy.url().should('include', '/guide');
        })
    });
});

export { };