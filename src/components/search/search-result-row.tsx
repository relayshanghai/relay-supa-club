import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { ShareLink } from 'src/components/icons';
import { useSearch } from 'src/hooks/use-search';
import { imgProxy } from 'src/utils/fetcher';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import type { CreatorSearchAccountObject } from 'types';

export const SearchResultRow = ({
    creator,

    setShowCampaignListModal,
    setSelectedCreator,
}: {
    creator: CreatorSearchAccountObject;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowCampaignListModal: (show: boolean) => void;
}) => {
    const { t } = useTranslation();
    const { platform } = useSearch();
    const {
        username,
        custom_name,
        fullname,
        user_id,
        url,
        picture,
        followers,
        engagements,
        engagement_rate,
        avg_views,
    } = creator.account.user_profile;
    const handle = username || custom_name || fullname || '';
    const addToCampaign = () => {
        setShowCampaignListModal(true);
        if (creator) setSelectedCreator(creator);
    };

    return (
        <tr className={`duration-1 group relative hover:bg-primary-100`}>
            <td className="invisible absolute right-28 -top-3 flex group-hover:visible">
                <div className="flex space-x-4">
                    <Button onClick={addToCampaign} variant="secondary">
                        {t('creators.addToCampaign')}
                    </Button>
                    <Link
                        data-testid="analyze-button"
                        href={`/influencer/${platform}/${user_id}`}
                        target="_blank"
                    >
                        <Button>{t('creators.analyzeProfile')}</Button>
                    </Link>

                    {url && (
                        <Link href={url} target="_blank" rel="noopener noreferrer">
                            <Button>
                                <ShareLink className="h-5 w-4 fill-current text-white" />
                            </Button>
                        </Link>
                    )}
                </div>
            </td>

            <td className="flex min-w-min flex-row items-center space-x-2 py-2 px-4">
                <img src={imgProxy(picture) as string} className="h-12 w-12" alt={handle} />
                <div>
                    <div className="font-bold line-clamp-2">{fullname}</div>
                    <div className="text-sm text-primary-500 line-clamp-1">
                        {handle ? `@${handle}` : null}
                    </div>
                </div>
            </td>
            <td className="text-sm">{numberFormatter(followers) ?? '-'}</td>
            <td className="text-sm">{numberFormatter(engagements) ?? '-'}</td>
            <td className="text-sm">{decimalToPercent(engagement_rate) ?? '-'}</td>
            <td className="text-sm">{numberFormatter(avg_views) ?? '-'}</td>
        </tr>
    );
};
