import Image from 'next/legacy/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import { numFormatter } from 'src/utils/utils';
import { CreatorPlatform, SimilarUser } from 'types';
import { Button } from '../button';
import { ShareLink } from '../icons';

export const SimilarCreator = ({
    creator,
    platform,
}: {
    creator: SimilarUser;
    platform: CreatorPlatform;
}) => {
    const { t } = useTranslation();
    return (
        <div className="group bg-white flex items-center justify-between p-4 rounded-xl mb-2">
            <div className="flex items-center justify-between flex-1 overflow-hidden">
                <div className="mr-4 flex-shrink-0 flex items-center">
                    <Image
                        src={imgProxy(creator.picture) || '/assets/imgs/image404.png'}
                        className="rounded-full"
                        width={40}
                        height={40}
                        alt={`${creator.fullname}-avatar`}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 duration-300 font-semibold">
                        {creator.fullname}
                    </p>
                    <div>
                        <p className="text-xs text-gray-600">
                            {numFormatter(creator.followers)} followers
                        </p>
                        {creator?.geo && (
                            <p className="text-xs text-gray-600">{creator?.geo?.country?.name}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center ml-4">
                <Button variant="secondary" className="px-3 py-1">
                    <Link href={`/influencer/${platform}/${creator.user_id}`}>
                        <a>{t('creators.analyzeProfile')}</a>
                    </Link>
                </Button>
                <Button className="ml-2">
                    <Link href={creator.url}>
                        <a target="_blank" rel="noopener noreferrer">
                            <ShareLink className="w-3 fill-current text-white" />
                        </a>
                    </Link>
                </Button>
            </div>
        </div>
    );
};
