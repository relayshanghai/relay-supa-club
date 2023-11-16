import { testMount } from '../../../utils/cypress-app-wrapper';
import { BoostbotAccountCell } from './boostbot-account-cell';
import boostbotGetInfluencers from '../../../mocks/api/boostbot/get-influencers.json';

describe('<BoostbotAccountCell />', () => {
    const influencer = boostbotGetInfluencers[0];
    const row = { original: influencer, index: 0 } as any;
    const table = {
        options: { meta: { searchId: 1, t: () => null } },
        getState: () => ({ pagination: { pageIndex: 1 } }),
    } as any;

    it('Renders influencer data correctly', () => {
        testMount(<BoostbotAccountCell row={row} table={table} />);

        cy.get('img').should('have.attr', 'src', influencer.picture);
        cy.getByTestId('boostbot-social-profile-link').should('have.attr', 'href', influencer.url);
    });

    it('Should have a correct link to the social media page', () => {
        testMount(<BoostbotAccountCell row={row} table={table} />);

        cy.getByTestId('boostbot-social-profile-link').should('have.attr', 'target', '_blank');
        cy.getByTestId('boostbot-social-profile-link').should('have.attr', 'rel', 'noopener noreferrer');
        cy.getByTestId('boostbot-social-profile-link').should('have.attr', 'href', row.original.url);
    });
});
