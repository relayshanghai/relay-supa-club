import { testMount } from 'src/utils/cypress-app-wrapper';
import { SearchCreators } from './search-creators';

describe('Search Creators', () => {
    it('should render', () => {
        testMount(<SearchCreators />);
        cy.getByTestId('platform-dropdown').click();
        cy.getByTestId('youtube-platform').should('exist');
        cy.getByTestId('youtube-option').should('exist');
        cy.getByTestId('tiktok-option').should('exist');
        cy.getByTestId('instagram-option').should('exist');
        cy.getByTestId('instagram-option').click();
        cy.getByTestId('instagram-platform').should('exist');
    });
});
