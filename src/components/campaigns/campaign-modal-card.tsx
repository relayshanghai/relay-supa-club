import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { CreatorUserProfile, CreatorPlatform } from 'types';
import { useEffect, useState } from 'react';
import { Spinner } from '../icons';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { clientLogger } from 'src/utils/logger';
import { useUser } from 'src/hooks/use-user';

export default function CampaignModalCard({
    campaign,
    creator,
    platform,
}: {
    campaign: CampaignWithCompanyCreators;
    creator: CreatorUserProfile | null;
    platform: CreatorPlatform;
}) {
    const supabase = useSupabaseClient();
    const { addCreatorToCampaign, loading } = useCampaigns({
        campaignId: campaign?.id,
    });
    const [hasCreator, setHasCreator] = useState<boolean>(false);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const { profile } = useUser();
    const { t } = useTranslation();

    const handleAddCreatorToCampaign = async () => {
        if (!campaign || !creator || !creator.user_id || !profile || !creator.picture)
            return toast.error(t('campaigns.form.oopsSomethingWrong'));
        try {
            await addCreatorToCampaign({
                campaign_id: campaign.id,
                creator_id: creator.user_id,
                avatar_url: creator.picture,
                username: creator.username,
                fullname: creator.fullname,
                link_url: creator.url,
                platform,
                added_by_id: profile.id,
            });
            toast.success(t('campaigns.modal.addedSuccessfully'));
            setHasCreator(true);
        } catch (error) {
            clientLogger(error, 'error');
            return toast.error(t('campaigns.form.oopsSomethingWrong'));
        }
    };

    useEffect(() => {
        const getFiles = async () => {
            const getFilePath = (filename: string) => {
                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from('images')
                    .getPublicUrl(`campaigns/${campaign?.id}/${filename}`);
                return publicUrl;
            };

            const { data } = await supabase.storage
                .from('images')
                .list(`campaigns/${campaign?.id}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                });

            if (data?.[0]?.name) {
                const imageUrl = `${getFilePath(data?.[0]?.name)}`;
                setCoverImageUrl(imageUrl);
            }
        };
        if (campaign) {
            getFiles();
        }
    }, [campaign, supabase]);

    useEffect(() => {
        if (campaign && creator) {
            const creatorInCampaign = campaign?.campaign_creators?.find(
                (campaignCreator) => campaignCreator.creator_id === creator?.user_id,
            );
            if (creatorInCampaign) {
                setHasCreator(true);
            }
        }
    }, [campaign, creator]);

    return (
        <div className="bg-white text-sm px-2 py-3.5 rounded-lg mb-2 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center w-full min-w-0">
                    <img
                        src={coverImageUrl || '/assets/imgs/image404.png'}
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
                    <button
                        onClick={handleAddCreatorToCampaign}
                        disabled={hasCreator || !campaign || !creator || !creator.user_id}
                        className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-md flex-shrink-0 hover:shadow-md duration-300 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {!loading && (
                            <PlusCircleIcon className="fill-current text-current w-4 h-4" />
                        )}
                        {loading && <Spinner className=" fill-primary-600 text-white w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}
