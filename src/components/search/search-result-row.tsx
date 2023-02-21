import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { ShareLink } from 'src/components/icons';
import { useSearch } from 'src/hooks/use-search';
import { imgProxy } from 'src/utils/fetcher';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import { CreatorSearchAccountObject } from 'types';

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
        <tr className={`relative group duration-1 hover:bg-primary-100`}>
            <td className="invisible absolute flex right-28 -top-3 group-hover:visible">
                <div className="flex space-x-4">
                    <Button onClick={addToCampaign} variant="secondary">
                        {t('creators.addToCampaign')}
                    </Button>
                    <Link href={`/influencer/${platform}/${user_id}`} target="_blank">
                        <Button>{t('creators.analyzeProfile')}</Button>
                    </Link>

                    {url && (
                        <Link href={url} target="_blank" rel="noopener noreferrer">
                            <Button>
                                <ShareLink className="w-4 h-5 fill-current text-white" />
                            </Button>
                        </Link>
                    )}
                </div>
            </td>

            <td className="py-2 px-4 flex flex-row items-center space-x-2 min-w-min">
                <img src={imgProxy(picture) as string} className="w-12 h-12" alt={handle} />
                <div>
                    <div className="font-bold line-clamp-2">{fullname}</div>
                    <div className="text-primary-500 text-sm line-clamp-1">
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
