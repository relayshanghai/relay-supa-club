import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import { numFormatter } from 'src/utils/utils';
import type { CreatorPlatform, SimilarUser } from 'types';
import { Button } from '../button';
import { ShareLink } from '../icons';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { ANALYZE_PAGE } from 'src/utils/rudderstack/event-names';

export const SimilarCreator = ({ creator, platform }: { creator: SimilarUser; platform: CreatorPlatform }) => {
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    return (
        <div className="group mb-2 flex items-center justify-between rounded-xl bg-white p-4">
            <div className="flex flex-1 items-center justify-between overflow-hidden">
                <div className="mr-4 flex flex-shrink-0 items-center">
                    <img
                        src={imgProxy(creator.picture) || '/assets/imgs/image404.png'}
                        className="rounded-full"
                        width={40}
                        height={40}
                        alt={`${creator.fullname}-avatar`}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 duration-300">{creator.fullname}</p>
                    <div>
                        <p className="text-xs text-gray-600">{numFormatter(creator.followers)} followers</p>
                        {creator?.geo && <p className="text-xs text-gray-600">{creator?.geo?.country?.name}</p>}
                    </div>
                </div>
            </div>
            <div className="ml-4 flex items-center">
                <Button
                    variant="secondary"
                    className="px-3 py-1"
                    onClick={() => {
                        trackEvent(ANALYZE_PAGE('Similar Influencer Section, open report'), {
                            platform,
                            user_id: creator.user_id,
                            // @note total_reports is an incrementable property
                            total_reports: 1,
                        });
                    }}
                >
                    <Link href={`/influencer/${platform}/${creator.user_id}`}>{t('creators.analyzeProfile')}</Link>
                </Button>
                <Button className="ml-2">
                    <Link href={creator.url} target="_blank" rel="noopener noreferrer">
                        <ShareLink className="w-3 fill-current text-white" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};
