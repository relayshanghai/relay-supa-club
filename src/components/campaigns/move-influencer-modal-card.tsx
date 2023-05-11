import { CheckCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import type { CreatorPlatform } from 'types';
import { useEffect, useState } from 'react';
import { Spinner } from '../icons';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { CampaignCreatorDB, CampaignDB } from 'src/utils/api/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { clientLogger } from 'src/utils/logger-client';
import { useUser } from 'src/hooks/use-user';
import { isMissing } from 'src/utils/utils';
import { useCampaignCreators } from 'src/hooks/use-campaign-creators';

export default function MoveInfluencerModalCard({
    targetCampaign,
    creator,
    currentCampaign,
}: {
    targetCampaign: CampaignDB;
    creator: CampaignCreatorDB;
    platform: CreatorPlatform;
    currentCampaign: CampaignDB;
}) {
    const supabase = useSupabaseClient();

    const {
        deleteCreatorInCampaign,
        addCreatorToCampaign,
        refreshCampaignCreators,
        loading,
        campaignCreators: currentCampaignCreators,
    } = useCampaignCreators({
        campaign: currentCampaign,
    });
    const { campaignCreators: targetCampaignCreators } = useCampaignCreators({
        campaign: targetCampaign,
    });

    const [_, setCurrentHasCreator] = useState<boolean>(false);
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
            });

            await deleteCreatorInCampaign({
                creatorId: creator.id,
                campaignId: currentCampaign.id,
            });
            setTargetHasCreator(true);
            setCurrentHasCreator(false);

            refreshCampaignCreators();

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
                } = supabase.storage.from('images').getPublicUrl(`campaigns/${targetCampaign.id}/${filename}`);
                return publicUrl;
            };

            const { data } = await supabase.storage.from('images').list(`campaigns/${targetCampaign.id}`, {
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
        if (targetCampaignCreators && creator) {
            const creatorInCampaign = targetCampaignCreators?.some(
                (campaignCreator) => campaignCreator.creator_id === creator.creator_id,
            );
            setTargetHasCreator(creatorInCampaign);
        }
    }, [targetCampaignCreators, creator]);

    useEffect(() => {
        if (currentCampaignCreators && creator) {
            const creatorInCampaign = currentCampaignCreators?.some(
                (campaignCreator) => campaignCreator.creator_id === creator.creator_id,
            );
            setCurrentHasCreator(creatorInCampaign);
        }
    }, [currentCampaignCreators, creator]);

    return (
        <div className="mb-2 rounded-lg bg-white px-2 py-3.5 text-sm duration-300">
            <div className="flex items-center justify-between">
                <div className="flex w-full min-w-0 items-center">
                    <img
                        src={coverImageUrl || '/assets/imgs/image404.png'}
                        alt=""
                        className="mr-2 h-6 w-6 flex-shrink-0 rounded-full object-cover"
                    />
                    <div className="mr-2 w-full truncate text-sm text-gray-600">{targetCampaign?.name}</div>
                </div>

                {targetCampaign && targetHasCreator && (
                    <div
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary-100"
                        id={`move-influencer-checkmark-${targetCampaign.id}`}
                    >
                        <CheckCircleIcon className="h-4 w-4 fill-current text-primary-500" />
                    </div>
                )}

                {targetCampaign && !targetHasCreator && (
                    <button
                        id={`move-influencer-button-${targetCampaign.id}`}
                        onClick={handleMoveCreatorToCampaign}
                        disabled={
                            loading || targetHasCreator || isMissing(targetCampaign, creator, creator?.creator_id)
                        }
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 duration-300 hover:shadow-md disabled:cursor-not-allowed disabled:text-gray-400"
                        data-testid={`move-influencer-button:${targetCampaign.name}`}
                    >
                        {!loading && <ArrowRightCircleIcon className="h-4 w-4 fill-current text-current" />}
                        {loading && (
                            <Spinner
                                id={`move-influencer-spinner-${targetCampaign.id}`}
                                className=" h-4 w-4 fill-primary-600 text-white"
                            />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
