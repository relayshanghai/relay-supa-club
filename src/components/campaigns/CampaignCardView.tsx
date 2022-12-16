import CampaignCardSquare from './CampaignCardSquare';

export default function CampaignCardView({ campaigns }: { campaigns: any[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {campaigns.map((campaign, index) => (
                <div key={index}>
                    <CampaignCardSquare campaign={campaign} />
                </div>
            ))}
        </div>
    );
}
