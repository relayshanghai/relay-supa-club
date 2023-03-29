// 1. on a campaign page, I get a list of influencers. -> campaigns/[id].tsx
// 2. on an influencer row, I can see a button called "Move Influencer" -> campaign-influencers-table.tsx
// 3. when I click on the "Move Influencer" button, I get a modal with a list of campaigns.
// 4. when I click on the move button inside a campaign row and I get a loading spinner
// 5. I get a checkmark and the old campaign doesn't have a checkmark.
// 6. In the source campaign, I don't see the influencer anymore.
// 7. In the target campaign, I see the influencer with all the details preserved from the source campaign.
// Changed files: campaigns/[id].tsx, creator-outreach.tsx, influencer-row.tsx, move-influencer-modal-card.tsx, use-campaigns.tsx

import { testMount } from '../../utils/cypress-app-wrapper';
import type { CreatorsOutreachProps } from './campaign-influencers-table';
import CampaignInfluencersTable from './campaign-influencers-table';

describe('CampaignInfluencersTable', () => {
    it('should render successfully', () => {
        const props: CreatorsOutreachProps = {
            currentCampaign,
            campaigns,
        };
        testMount(<CampaignInfluencersTable />);
    });
});
