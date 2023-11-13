import { testMount } from '../../../utils/cypress-app-wrapper';
import { OpenInfluencerModalCell } from './boostbot-icon-cell';
import boostbotGetInfluencers from '../../../mocks/api/boostbot/get-influencers.json';
import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';

describe('<OpenInfluencerModalCell />', () => {
    let setIsInfluencerDetailsModalOpen: (open: boolean) => void;
    let setSelectedRow: (row: Row<BoostbotInfluencer>) => void;

    beforeEach(() => {
        setIsInfluencerDetailsModalOpen = cy.stub();
        setSelectedRow = cy.stub();
    });

    it('Should call setIsInfluencerDetailsModalOpen when the icon is clicked', () => {
        const influencer = boostbotGetInfluencers[0];
        const row = { original: influencer, index: 0 } as Row<BoostbotInfluencer>;
        const table = {
            options: { meta: { searchId: 1, t: () => null } },
            getState: () => ({ pagination: { pageIndex: 1 } }),
        } as any;

        testMount(
            <OpenInfluencerModalCell
                row={row}
                table={table}
                setIsInfluencerDetailsModalOpen={setIsInfluencerDetailsModalOpen}
                setSelectedRow={setSelectedRow}
            />,
        );

        cy.getByTestId('boostbot-open-modal-icon').click({ force: true });
        cy.wrap(setIsInfluencerDetailsModalOpen).should('have.been.called');
    });
});
