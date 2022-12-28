import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { CreatorPlatform, CreatorReport } from 'types';
import { Button } from '../button';
import { SocialMediaIcon } from '../common/social-media-icon';

export const TitleSection = ({
    user_profile,
    reportCreatedAt,
    onAddToCampaign,
    platform
}: {
    user_profile: CreatorReport['user_profile'];
    reportCreatedAt: string | null;
    onAddToCampaign: () => void;
    platform: CreatorPlatform;
}) => {
    const { t } = useTranslation();
    return (
        <div className="p-6">
            <div className="flex items-center">
                <div className="relative w-28 h-28">
                    <Image
                        src={user_profile.picture}
                        alt={`${user_profile.user_id}-profile-pic`}
                        layout="fill"
                        className="rounded-full"
                    />
                    <div className="absolute right-0 bottom-0">
                        <SocialMediaIcon platform={platform} width={28} height={28} />
                    </div>
                </div>
                <div className="ml-6 flex-1">
                    <h1 className="poppins font-bold text-4xl text-gray-800 mb-1">
                        {user_profile.fullname || user_profile.username}
                    </h1>
                    <a
                        href={user_profile.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary-500 hover:text-primary-700 duration-300 cursor-pointer"
                    >
                        {t('creators.show.openLink')}
                    </a>
                </div>
            </div>
            {reportCreatedAt && (
                <span className="flex text-sm mt-3">
                    <p className="text-gray-400 mr-2">{t('creators.show.lastUpdate')}</p>
                    <p className="text-gray-600">
                        {new Date(reportCreatedAt).toLocaleDateString()}
                    </p>
                </span>
            )}
            <Button onClick={onAddToCampaign} className="my-6" variant="secondary">
                {t('creators.show.addToCampaign')}
            </Button>
        </div>
    );
};
