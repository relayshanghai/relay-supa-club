import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import { numFormatter } from 'src/utils/utils';
import { AudienceLookalike, CreatorPlatform } from 'types';

export default function CreatorCard({
    creator,
    platform,
}: {
    creator: AudienceLookalike;
    platform: CreatorPlatform;
}) {
    const { t } = useTranslation();
    return (
        <Link href={`/influencer/${platform}/${creator.user_id}`} target="_blank">
            <div className="flex items-center hover:bg-primary-50 cursor-pointer p-2 rounded-md">
                <div className="w-8 h-8 rounded-full flex-shrink-0 relative mr-4">
                    <img
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        src={imgProxy(creator.picture)}
                        alt={creator.fullname}
                    />
                </div>
                <div className="text-gray-600 text-xs">
                    <div className="font-semibold">{creator.fullname}</div>
                    <div className="flex">
                        <div className="mr-2">{t('creators.show.followers')}</div>
                        <div>{numFormatter(creator.followers)}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
