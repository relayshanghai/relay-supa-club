import { PlusCircleIcon } from '@heroicons/react/24/solid';
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
        <tr className="group hover:bg-primary-100 ">
            <td className="w-full">
                <div className="flex w-full flex-row gap-x-2 py-2 px-4">
                    <img src={imgProxy(picture) as string} className="h-12 w-12" alt={handle} />
                    <div>
                        <div className="font-bold line-clamp-2">{fullname}</div>
                        <div className="text-sm text-primary-500 line-clamp-1">
                            {handle ? `@${handle}` : null}
                        </div>
                    </div>
                </div>
            </td>
            <td className="text-right text-sm">{numberFormatter(followers) ?? '-'}</td>
            <td className="text-right text-sm">{numberFormatter(engagements) ?? '-'}</td>
            <td className="text-right text-sm">{decimalToPercent(engagement_rate) ?? '-'}</td>
            <td className="text-right text-sm">{numberFormatter(avg_views) ?? '-'}</td>
            <td className="whitespace-nowrap px-10">
                <div className="flex items-center gap-x-4 opacity-100 duration-300 group-hover:opacity-100">
                    <Button
                        onClick={addToCampaign}
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        <span className="hidden xl:inline-block">
                            {t('creators.addToCampaign')}
                        </span>
                    </Button>

                    <Link href={`/influencer/${platform}/${user_id}`} target="_blank">
                        <Button className="flex items-center gap-1">
                            <PlusCircleIcon className="h-5 w-5" />
                            <span className="hidden xl:inline-block">
                                {t('creators.analyzeProfile')}
                            </span>
                        </Button>
                    </Link>

                    {url && (
                        <Link href={url} target="_blank" rel="noopener noreferrer">
                            <Button>
                                <ShareLink className="h-5 w-5 fill-current text-white" />
                            </Button>
                        </Link>
                    )}
                </div>
            </td>
        </tr>
    );
};
