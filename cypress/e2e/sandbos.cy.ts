import { addPostIntercept } from "./intercepts";
import { deleteDB } from "idb";
​
describe('Sandbox tests', () => {
    beforeEach(async () => {
        await deleteDB('app-cache');
        //        ^- added it as custom command
    })
​
    it('Load Performance page', () => {
        addPostIntercept();
        cy.loginTestUser();
        cy.contains('Performance').should('have.length', 1)
    })
​
    it('Load index with session', async () => {
        addPostIntercept();
        cy.loginTestUser();
    });
});
​
// Need to export an empty object to keep typescript happy. Otherwise, it will complain that the file is a module, but it has no imports or exports.
export {};