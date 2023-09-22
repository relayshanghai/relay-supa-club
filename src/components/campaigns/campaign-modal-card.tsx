import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import type { CreatorUserProfile, CreatorPlatform } from 'types';
import { useEffect, useState } from 'react';
import { Spinner } from '../icons';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { CampaignDB } from 'src/utils/api/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { clientLogger } from 'src/utils/logger-client';
import { useUser } from 'src/hooks/use-user';
import { isMissing } from 'src/utils/utils';
import { useCampaignCreators } from 'src/hooks/use-campaign-creators';
import type { CampaignCreatorBasicInfo } from 'src/utils/api/db/calls/campaignCreators';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { CAMPAIGN_MODAL_CARD } from 'src/utils/rudderstack/event-names';

export default function CampaignModalCard({
    campaign,
    creator,
    platform,
    campaignCreators,
    track,
}: {
    campaign: CampaignDB;
    creator?: CreatorUserProfile | null;
    platform: CreatorPlatform;
    campaignCreators: CampaignCreatorBasicInfo[];
    track: (campaign: string) => void;
}) {
    const supabase = useSupabaseClient();
    const { addCreatorToCampaign, loading, refreshCampaignCreators } = useCampaignCreators({
        campaign,
    });
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const { profile } = useUser();
    const { t } = useTranslation();
    const [hasCreator, setHasCreator] = useState<boolean>(
        campaignCreators?.some((campaignCreator) => campaignCreator.creator_id === creator?.user_id),
    );
    const { trackEvent } = useRudderstack();

    const handleAddCreatorToCampaign = async () => {
        if (!campaign || !creator || !creator.user_id || !profile || !creator.picture)
            return toast.error(t('campaigns.form.oopsSomethingWrong'));
        try {
            await addCreatorToCampaign({
                campaign_id: campaign.id,
                status: 'to contact',
                creator_id: creator.user_id,
                avatar_url: creator.picture,
                username: creator.username,
                fullname: creator.fullname,
                link_url: creator.url,
                platform,
                added_by_id: profile.id,
            });
            toast.success(t('campaigns.modal.addedSuccessfully'));
            campaign && track(campaign.id);

            trackEvent(CAMPAIGN_MODAL_CARD('added creator to campaign'), {
                creator: creator?.username || creator?.fullname || creator?.user_id,
                campaign: campaign?.id,
            });
            setHasCreator(true);
            refreshCampaignCreators();
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
                } = supabase.storage.from('images').getPublicUrl(`campaigns/${campaign?.id}/${filename}`);
                return publicUrl;
            };

            const { data } = await supabase.storage.from('images').list(`campaigns/${campaign?.id}`, {
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

    return (
        <div className="mb-2 rounded-lg bg-white px-2 py-3.5 text-sm duration-300">
            <div className="flex items-center justify-between">
                <div className="flex w-full min-w-0 items-center">
                    <img
                        src={coverImageUrl || '/assets/imgs/image404.png'}
                        alt=""
                        className="mr-2 h-6 w-6 flex-shrink-0 rounded-full object-cover"
                    />
                    <div className="mr-2 w-full truncate text-sm text-gray-600">{campaign?.name}</div>
                </div>

                {campaign && hasCreator && (
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary-100">
                        <CheckCircleIcon className="h-4 w-4 fill-current text-primary-500" />
                    </div>
                )}

                {campaign && !hasCreator && (
                    <button
                        onClick={handleAddCreatorToCampaign}
                        disabled={loading || hasCreator || isMissing(campaign, creator, creator?.user_id)}
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 duration-300 hover:shadow-md disabled:cursor-not-allowed  disabled:text-gray-400"
                        data-testid={`add-creator-button:${campaign.name}`}
                    >
                        {!loading && <PlusCircleIcon className="h-4 w-4 fill-current text-current" />}
                        {loading && <Spinner className=" h-4 w-4 fill-primary-600 text-white" />}
                    </button>
                )}
            </div>
        </div>
    );
}
