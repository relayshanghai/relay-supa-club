import type { CampaignDB } from 'src/utils/api/db';
import CampaignCardSquare from './CampaignCardSquare';

export default function CampaignCardView({ campaigns, currentTab }: { campaigns: CampaignDB[]; currentTab: string }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {campaigns.map((campaign, index) => {
                if (campaign.status === currentTab || currentTab === '' || currentTab === 'archived')
                    return (
                        <div key={index} id={`campaign-card-${campaign.slug}`}>
                            <CampaignCardSquare campaign={campaign} />
                        </div>
                    );
            })}
        </div>
    );
}
