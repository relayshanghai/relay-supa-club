import Link from 'next/link';
// import { trackEvent } from "@/libs/segment/Events";
export default function CampaignCardText({ t, campaign }) {
    const goToCampaign = (e, status) => {
        e.stopPropagation();
        // trackEvent('Campaign Card Status Clicked', { campaign, status: status[0] });
    };

    return (
        <>
            <div className="text-sm text-tertiary-600 font-semibold">{campaign.name}</div>
            <div className="text-xs text-tertiary-600 mb-2">{campaign?.companies?.name}</div>
            <div className="flex items-center flex-wrap">
                {campaign.status_counts &&
                    Object.entries(campaign.status_counts).map((status, index) => (
                        <Link
                            key={index}
                            href={`/dashboard/campaigns/${campaign.slug}?curTab=${status[0]}`}
                        >
                            <div
                                onClick={(e) => goToCampaign(e, status)}
                                className="flex items-center text-xs px-1 py-0.5 bg-primary-100 text-gray-600 hover:text-primary-500 duration-300 bg-opacity-60 border border-gray-100 rounded-md mr-2 mb-2"
                            >
                                <div className="mr-1">Change Status</div>
                                <div>{status[1]}</div>
                            </div>
                        </Link>
                    ))}
            </div>
        </>
    );
}
