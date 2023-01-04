import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { CampaignWithCompanyCreators, CreatorSearchAccountObject } from 'types';
import { useEffect, useState } from 'react';
import { Spinner } from '../icons';
import { supabase } from 'src/utils/supabase-client';

export default function CampaignModalCard({
    campaign,
    creator
}: {
    campaign: CampaignWithCompanyCreators;
    creator: CreatorSearchAccountObject | null;
}) {
    const { addCreatorToCampaign, loading } = useCampaigns({
        campaignId: campaign?.id
    });
    const [hasCreator, setHasCreator] = useState<boolean>(false);
    const [coverImageUrl, setCoverImageUrl] = useState('');

    const handleAddCreatorToCampaign = async () => {
        if (creator && !hasCreator)
            await addCreatorToCampaign({
                campaign_id: campaign.id,
                creator_id: creator?.account.user_profile?.user_id,
                avatar_url: creator?.account.user_profile?.picture,
                username: creator?.account.user_profile?.username,
                fullname: creator?.account.user_profile?.fullname,
                link_url: creator?.account.user_profile?.url
            }).then(() => {
                setHasCreator(true);
            });
    };

    useEffect(() => {
        const getFiles = async () => {
            const getFilePath = (filename: string) => {
                const { publicURL } = supabase.storage
                    .from('images')
                    .getPublicUrl(`campaigns/${campaign?.id}/${filename}`);
                return publicURL;
            };

            const { data } = await supabase.storage
                .from('images')
                .list(`campaigns/${campaign?.id}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (data?.[0]?.name) {
                const imageUrl = `${getFilePath(data?.[0]?.name)}`;
                setCoverImageUrl(imageUrl);
            }
        };
        if (campaign) {
            getFiles();
        }
    }, [campaign]);

    useEffect(() => {
        if (campaign && creator) {
            const creatorInCampaign = campaign?.campaign_creators?.find(
                (campaignCreator) =>
                    campaignCreator.creator_id === creator?.account.user_profile?.user_id
            );
            if (creatorInCampaign) {
                setHasCreator(true);
            }
        }
    }, [campaign, creator]);

    return (
        <div
            onClick={handleAddCreatorToCampaign}
            className="bg-white text-sm px-2 py-3.5 rounded-lg mb-2 cursor-pointer duration-300"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center w-full min-w-0">
                    <img
                        src={coverImageUrl || '/image404.png'}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0 mr-2"
                    />
                    <div className="text-sm text-gray-600 truncate w-full mr-2">
                        {campaign?.name}
                    </div>
                </div>

                {campaign && hasCreator && (
                    <div className="flex items-center justify-center w-6 h-6 bg-primary-100 rounded-md flex-shrink-0">
                        <CheckCircleIcon className="fill-current text-primary-500 w-4 h-4" />
                    </div>
                )}

                {campaign && !hasCreator && (
                    <div className="flex items-center justify-center w-6 h-6 bg-tertiary-100 rounded-md flex-shrink-0 hover:shadow-md duration-300 cursor-pointer">
                        {!loading && (
                            <PlusCircleIcon className="fill-current text-tertiary-600 w-4 h-4" />
                        )}
                        {loading && <Spinner className=" fill-current w-4 h-4" />}
                    </div>
                )}
            </div>
        </div>
    );
}
