import { testMount } from '../../../utils/cypress-app-wrapper';
import boostbotGetInfluencers from '../../../mocks/api/boostbot/get-influencers.json';
import { BoostbotFollowersCell } from './boostbot-followers-cell';
import { numberFormatter } from 'src/utils/formatter';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { Row } from '@tanstack/react-table';

describe('<BoostbotFollowersCell />', () => {
    const influencer = boostbotGetInfluencers[0];
    const row = { original: influencer, index: 0 } as Row<BoostbotInfluencer>;
    const table = {
        options: { meta: { searchId: 1, t: () => null } },
        getState: () => ({ pagination: { pageIndex: 1 } }),
    } as any;

    it('Should display the correct followers in format', () => {
        const followers = row.original.followers;
        const formattedFollowers = numberFormatter(followers, 1) as string;

        testMount(<BoostbotFollowersCell table={table} row={row} />);
        cy.get('div').contains(formattedFollowers);
    });
});
