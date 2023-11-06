import { testMount } from '../../utils/cypress-app-wrapper';
import { InfluencerDetailsModal } from 'src/components/boostbot/modal-influencer-details';
import boostbotGetInfluencers from '../../mocks/api/boostbot/get-influencers.json';
import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';

describe('InfluencerDetailsModal', () => {
    const influencer = boostbotGetInfluencers[0];
    const selectedRow = { original: influencer, index: 0 } as Row<BoostbotInfluencer>;
    const isOpen = true;
    it('renders influencer basic info', () => {
        const setIsOpen = cy.stub();
        testMount(<InfluencerDetailsModal selectedRow={selectedRow} isOpen={isOpen} setIsOpen={setIsOpen} />);
        cy.get('img').should('have.attr', 'src', influencer.picture);
        cy.contains(influencer.fullname);
        cy.contains(influencer.handle ?? influencer.username);
    });

    it('have a correct link to the analyze page', () => {
        const setIsOpen = cy.stub();
        const url = selectedRow.original.url;
        const platform = url.includes('youtube') ? 'youtube' : url.includes('tiktok') ? 'tiktok' : 'instagram';

        testMount(<InfluencerDetailsModal selectedRow={selectedRow} isOpen={isOpen} setIsOpen={setIsOpen} />);
        cy.getByTestId('boostbot-modal-open-report-link').should('have.attr', 'target', '_blank');
        cy.getByTestId('boostbot-modal-open-report-link').should('have.attr', 'rel', 'noopener noreferrer');
        cy.getByTestId('boostbot-modal-open-report-link').should(
            'have.attr',
            'href',
            `/influencer/${encodeURIComponent(platform)}/${encodeURIComponent(selectedRow.original.user_id)}`,
        );
    });
});