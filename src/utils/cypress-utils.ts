// official example is broken https://www.cypress.io/blog/2020/11/12/testing-application-in-offline-network-mode/
// https://github.com/cypress-io/cypress/issues/17723
export const goOffline = () => {
    cy.log('**go offline**')
        // stub every request with a StaticResponse to simulate network error
        .then(() => cy.intercept('*', { forceNetworkError: true }))
        .then(() => cy.window().then((win) => win.dispatchEvent(new Event('offline'))));
};
export const goOnline = () => {
    cy.log('**go online**')
        // go back to normal network behavior
        .then(() => cy.intercept('*'))
        .then(() => cy.window().then((win) => win.dispatchEvent(new Event('online'))));
};
export const assertOnline = () => {
    return cy.wrap(window).its('navigator.onLine').should('be.true');
};

export const assertOffline = () => {
    return cy.wrap(window).its('navigator.onLine').should('be.false');
};
