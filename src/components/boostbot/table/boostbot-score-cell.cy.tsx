import { testMount } from '../../../utils/cypress-app-wrapper';
import { BoostbotScoreCell, calculateIndexScore } from './boostbot-score-cell';
import boostbotGetInfluencers from '../../../mocks/api/boostbot/get-influencers.json';

describe('<BoostbotScoreCell />', () => {
    const influencer = boostbotGetInfluencers[0];
    const row = { original: influencer, index: 0 } as any;
    const table = {
        options: { meta: { searchId: 1, t: () => null } },
        getState: () => ({ pagination: { pageIndex: 1 } }),
    } as any;

    it('Should display the correct index score', () => {
        const expectedIndexScore = calculateIndexScore(influencer);

        testMount(<BoostbotScoreCell row={row} table={table} />);

        cy.get('div').contains(expectedIndexScore);
    });
});
