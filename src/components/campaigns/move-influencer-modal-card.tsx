import { CheckCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { useCampaigns } from 'src/hooks/use-campaigns';
import type { CreatorPlatform } from 'types';
import { useEffect, useState } from 'react';
import { Spinner } from '../icons';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { CampaignCreatorDB, CampaignWithCompanyCreators } from 'src/utils/api/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { clientLogger } from 'src/utils/logger';
import { useUser } from 'src/hooks/use-user';
import { isMissing } from 'src/utils/utils';

export default function MoveInfluencerModalCard({
    targetCampaign,
    creator,
    currentCampaign,
}: {
    targetCampaign: CampaignWithCompanyCreators;
    creator: CampaignCreatorDB;
    platform: CreatorPlatform;
    currentCampaign: CampaignWithCompanyCreators;
}) {
    const supabase = useSupabaseClient();

    const { addCreatorToCampaign, loading } = useCampaigns({
        campaignId: targetCampaign.id,
    });

    const {
        deleteCreatorInCampaign,
        loading: deleteCampaginLoading,
        refreshCampaign,
    } = useCampaigns({
        campaignId: currentCampaign.id,
    });

    const [currentHasCreator, setCurrentHasCreator] = useState<boolean>(false);
    const [targetHasCreator, setTargetHasCreator] = useState<boolean>(false);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const { profile } = useUser();
    const { t } = useTranslation();

    const handleMoveCreatorToCampaign = async () => {
        if (!targetCampaign || !creator || !creator || !profile)
            return toast.error(t('campaigns.form.oopsSomethingWrong'));
        try {
            await addCreatorToCampaign({
                ...creator,
                campaign_id: targetCampaign.id,
                creator_id: creator.creator_id,
                avatar_url: creator.avatar_url,
                username: creator.username,
                fullname: creator.fullname,
                link_url: creator.link_url,
                platform: creator.platform,
                added_by_id: profile.id,
                id: undefined,
            });

            await deleteCreatorInCampaign(creator);
            setTargetHasCreator(true);
            setCurrentHasCreator(false);

            refreshCampaign();

            toast.success(t('campaigns.modal.movedSuccessfully'));
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
                    .getPublicUrl(`campaigns/${targetCampaign.id}/${filename}`);
                return publicUrl;
            };

            const { data } = await supabase.storage
                .from('images')
                .list(`campaigns/${targetCampaign.id}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                });

            if (data?.[0]?.name) {
                const imageUrl = `${getFilePath(data?.[0]?.name)}`;
                setCoverImageUrl(imageUrl);
            }
        };
        if (targetCampaign) {
            getFiles();
        }
    }, [targetCampaign, supabase]);

    useEffect(() => {
        if (targetCampaign && creator) {
            const creatorInCampaign = targetCampaign.campaign_creators.find(
                (campaignCreator) => campaignCreator.creator_id === creator.creator_id,
            );
            if (creatorInCampaign) {
                setTargetHasCreator(true);
            } else {
                setTargetHasCreator(false);
            }
        }
    }, [targetCampaign, creator]);

    useEffect(() => {
        if (currentCampaign && creator) {
            const creatorInCampaign = currentCampaign.campaign_creators.find(
                (campaignCreator) => campaignCreator.creator_id === creator.creator_id,
            );
            if (creatorInCampaign) {
                setCurrentHasCreator(true);
            } else {
                setCurrentHasCreator(false);
            }
        }
    }, [currentCampaign, creator]);

    return (
        <div className="mb-2 rounded-lg bg-white px-2 py-3.5 text-sm duration-300">
            <div className="flex items-center justify-between">
                <div className="flex w-full min-w-0 items-center">
                    <img
                        src={coverImageUrl || '/assets/imgs/image404.png'}
                        alt=""
                        className="mr-2 h-6 w-6 flex-shrink-0 rounded-full object-cover"
                    />
                    <div className="mr-2 w-full truncate text-sm text-gray-600">
                        {targetCampaign?.name}
                    </div>
                </div>

                {targetCampaign && targetHasCreator && (
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary-100">
                        <CheckCircleIcon className="h-4 w-4 fill-current text-primary-500" />
                    </div>
                )}

                {targetCampaign && !targetHasCreator && (
                    <button
                        onClick={handleMoveCreatorToCampaign}
                        disabled={
                            targetHasCreator ||
                            isMissing(targetCampaign, creator, creator?.creator_id)
                        }
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 duration-300 hover:shadow-md disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                        {!loading && !deleteCampaginLoading && (
                            <ArrowRightCircleIcon className="h-4 w-4 fill-current text-current" />
                        )}
                        {(loading || deleteCampaginLoading) && (
                            <Spinner className=" h-4 w-4 fill-primary-600 text-white" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
