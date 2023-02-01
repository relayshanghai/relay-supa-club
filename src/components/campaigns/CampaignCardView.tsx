import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import CampaignCardSquare from './CampaignCardSquare';

export default function CampaignCardView({
    campaigns,
    currentTab,
}: {
    campaigns: CampaignWithCompanyCreators[];
    currentTab: string;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {campaigns.map((campaign, index) => {
                if (campaign.status === currentTab || currentTab === '')
                    return (
                        <div key={index}>
                            <CampaignCardSquare campaign={campaign} />
                        </div>
                    );
            })}
        </div>
    );
}
