import { PlusCircleIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { CampaignDB, CreatorSearchAccountObject } from 'types';

export default function CampaignModalCard({
    campaign,
    creator
}: {
    campaign: CampaignDB;
    creator: CreatorSearchAccountObject | null;
}) {
    const { addCreatorToCampaign, loading } = useCampaigns({
        campaignId: campaign?.id
    });

    const handleAddCreatorToCampaign = () => {
        if (creator)
            addCreatorToCampaign({
                campaign_id: campaign.id,
                id: creator?.account.user_profile?.user_id,
                avatar_url: creator?.account.user_profile?.picture,
                username: creator?.account.user_profile?.username,
                fullname: creator?.account.user_profile?.fullname,
                link_url: creator?.account.user_profile?.url
            });
    };

    return (
        <div
            onClick={() => {
                handleAddCreatorToCampaign();
            }}
            className="bg-tertiary-50 text-sm px-2 py-3.5 rounded-lg mb-2 cursor-pointer duration-300"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center w-full min-w-0">
                    {/* TODO: add the right image url after */}
                    <img
                        src={'/image404.png'}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0 mr-2"
                    />
                    <div className="text-sm text-gray-600 truncate w-full mr-2">
                        {campaign?.name}
                    </div>
                </div>
                {/* TODO: fix the condition- if creator is already in campaign, show checkmark */}
                {/* {campaign?.hasCreator > 0 && (
                    <div className="flex items-center justify-center w-6 h-6 bg-primary-100 rounded-md flex-shrink-0">
                        <CheckCircleIcon className="fill-current text-primary-500" />
                    </div>
                )} */}
                {/* TODO: fix the condition - if creator is not in campaign, show below */}

                {campaign && (
                    <div className="flex items-center justify-center w-6 h-6 bg-white rounded-md flex-shrink-0 hover:shadow-md duration-300 cursor-pointer">
                        {!loading && (
                            <PlusCircleIcon className="fill-current text-tertiary-600 w-4 h-4" />
                        )}
                        {loading && (
                            <ArrowPathIcon className="fill-current text-tertiary-600 w-4 h-4" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
