import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorReport } from 'types';
import { Button } from '../button';
import { SocialMediaIcon } from '../common/social-media-icon';

export const TitleSection = ({
    user_profile,
    onAddToCampaign,
    platform,
}: {
    user_profile: CreatorReport['user_profile'];
    onAddToCampaign: () => void;
    platform: CreatorPlatform;
}) => {
    const { t } = useTranslation();
    return (
        <div className="p-6">
            <div className="flex items-center">
                <div className="relative h-28 w-28">
                    <img
                        src={imgProxy(user_profile.picture) as string}
                        alt={`${user_profile.user_id}-profile-pic`}
                        className="rounded-full"
                    />
                    <div className="absolute right-0 bottom-0">
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
                    >
                        {t('creators.show.openLink')}
                    </a>
                </div>
            </div>
            <Button onClick={onAddToCampaign} className="my-6" variant="secondary">
                {t('creators.show.addToCampaign')}
            </Button>
        </div>
    );
};
