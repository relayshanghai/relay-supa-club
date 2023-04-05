import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import { numFormatter } from 'src/utils/utils';
import type { AudienceLookalike, CreatorPlatform } from 'types';

export default function CreatorCard({ creator, platform }: { creator: AudienceLookalike; platform: CreatorPlatform }) {
    const { t } = useTranslation();
    return (
        <Link href={`/influencer/${platform}/${creator.user_id}`} target="_blank">
            <div className="flex cursor-pointer items-center rounded-md p-2 hover:bg-primary-50">
                <div className="relative mr-4 h-8 w-8 flex-shrink-0 rounded-full">
                    <img
                        className="h-8 w-8 flex-shrink-0 rounded-full"
                        src={imgProxy(creator.picture)}
                        alt={creator.fullname}
                    />
                </div>
                <div className="text-xs text-gray-600">
                    <div className="font-semibold">
                        {platform === 'instagram' ? creator.username || creator.fullname : creator.fullname}
                    </div>
                    <div className="flex">
                        <div className="mr-2">{t('creators.show.followers')}</div>
                        <div>{numFormatter(creator.followers)}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
