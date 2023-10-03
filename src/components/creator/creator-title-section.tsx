import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorReport } from 'types';
import { Button } from '../button';
import { SocialMediaIcon } from '../common/social-media-icon';
import { useAnalytics } from '../analytics/analytics-provider';
import { AnalyzeOpenExternalSocialProfile } from 'src/utils/analytics/events';
import { featEmail } from 'src/constants/feature-flags';
import { useUser } from 'src/hooks/use-user';

export const TitleSection = ({
    user_profile,
    onAddToCampaign,
    platform,
    onAddToSequence,
}: {
    user_profile: CreatorReport['user_profile'];
    onAddToCampaign: (selectedCreatorUserId: string) => void;
    platform: CreatorPlatform;
    onAddToSequence: () => void;
}) => {
    const { profile } = useUser();
    const { track } = useAnalytics();
    const { t } = useTranslation();
    const trackOpenLink = () => {
        track(AnalyzeOpenExternalSocialProfile, { url: user_profile.url });
    };
    return (
        <div className="p-6">
            <div className="flex items-center">
                <div className="relative h-28 w-28">
                    <img
                        src={imgProxy(user_profile.picture) as string}
                        alt={`${user_profile.user_id}-profile-pic`}
                        className="rounded-full"
                    />
                    <div className="absolute bottom-0 right-0">
                        <SocialMediaIcon platform={platform} width={28} height={28} />
                    </div>
                </div>
                <div className="ml-6 flex-1">
                    <h1 className="poppins mb-1 text-4xl font-bold text-gray-800">
                        {user_profile.fullname || user_profile.username}
                    </h1>
                    <a
                        href={user_profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-sm text-primary-500 duration-300 hover:text-primary-700"
                        onClick={trackOpenLink}
                    >
                        {t('creators.show.openLink')}
                    </a>
                </div>
            </div>
            {profile?.created_at && featEmail(new Date(profile.created_at)) ? (
                <Button onClick={onAddToSequence} className="my-6" variant="secondary">
                    {t('creators.addToSequence')}
                </Button>
            ) : (
                <Button onClick={() => onAddToCampaign(user_profile.user_id)} className="my-6" variant="secondary">
                    {t('creators.show.addToCampaign')}
                </Button>
            )}
        </div>
    );
};
