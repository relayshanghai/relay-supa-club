import Link from 'next/link';
import type { CampaignsIndexGetResult } from 'pages/api/campaigns';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import type { CreatorSearchAccountObject } from 'types';
import { Button } from '../button';
import { SkeletonSearchResultRow } from '../common/skeleton-search-result-row';
import { SearchResultRow } from './search-result-row';
import { FEAT_RECOMMENDED } from 'src/constants/feature-flags';
import { isRecommendedInfluencer } from 'src/constants/recommendedInfluencers';
import { useEffect, useState } from 'react';
export interface SearchResultsTableProps {
    setShowCampaignListModal: (show: boolean) => void;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowAlreadyAddedModal: (show: boolean) => void;
    campaigns?: CampaignsIndexGetResult;
    setCampaignsWithCreator: (campaigns: string[]) => void;
    onlyRecommended: boolean;
    results?: CreatorSearchAccountObject[];
    loading: boolean;
    moreResults?: JSX.Element;
}

export const SearchResultsTable = ({
    setShowCampaignListModal,
    setSelectedCreator,
    setShowAlreadyAddedModal,
    campaigns,
    setCampaignsWithCreator,
    onlyRecommended,
    results: resultsFull,
    loading: passedInLoading,
    moreResults,
}: SearchResultsTableProps) => {
    const { t } = useTranslation();
    const { platform, usageExceeded } = useSearch();
    const noResults = !resultsFull || resultsFull.length === 0;

    const results =
        FEAT_RECOMMENDED && onlyRecommended
            ? resultsFull?.filter((creator) => isRecommendedInfluencer(platform, creator.account.user_profile.user_id))
            : resultsFull;

    const [initialWait, setInitialWait] = useState(true);

    // This addresses a bug whereby 'no results found' flashes when SWR is actually loading results from localStorage
    useEffect(() => {
        if (initialWait) {
            setTimeout(() => {
                setInitialWait(false);
                // seems to be the minimum wait to avoid the flash
            }, 1300);
        }
    }, [initialWait]);
    const loading = initialWait || passedInLoading;

    return (
        <div className="w-full overflow-x-auto">
            <table
                className={`w-full table-fixed divide-y divide-gray-200 rounded-lg shadow ${
                    loading ? 'opacity-60' : ''
                }`}
            >
                <thead className="sticky top-0 bg-white">
                    <tr>
                        <th className="w-72 p-4 text-left text-xs font-normal text-gray-500">
                            {t('creators.account')}
                        </th>
                        <th className="w-24 whitespace-nowrap pr-4 text-right text-xs font-normal text-gray-500">
                            {t('creators.subscribers')}
                        </th>
                        <th className="w-24 whitespace-nowrap pr-4 text-right text-xs font-normal text-gray-500">
                            {t('creators.engagements')}
                        </th>
                        <th className="w-24 whitespace-nowrap pr-4 text-right text-xs font-normal text-gray-500">
                            {t('creators.engagementRate')}
                        </th>
                        <th className="w-24 whitespace-nowrap pr-4 text-right text-xs font-normal text-gray-500">
                            {t('creators.avgViews')}
                        </th>
                        <th className="w-28 lg:w-96">{''}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {usageExceeded && (
                        <tr>
                            <td className="space-y-4 py-4 text-center" colSpan={5}>
                                <p className="mb-4">{t('creators.usageExceeded')}</p>
                                <Link href="/pricing">
                                    <Button>{t('account.subscription.upgradeSubscription')}</Button>
                                </Link>
                            </td>
                        </tr>
                    )}

                    {!usageExceeded && !noResults && results && (
                        <>
                            {results.map((creator, i) => (
                                <SearchResultRow
                                    key={i}
                                    creator={creator}
                                    setShowCampaignListModal={setShowCampaignListModal}
                                    setSelectedCreator={setSelectedCreator}
                                    setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                                    campaigns={campaigns}
                                    setCampaignsWithCreator={setCampaignsWithCreator}
                                />
                            ))}
                            {moreResults}
                        </>
                    )}

                    {!usageExceeded &&
                        noResults &&
                        (loading ? (
                            [...Array(10)].map((_, i) => <SkeletonSearchResultRow key={i} delay={i * 200} />)
                        ) : (
                            <tr>
                                <td className="py-4 text-center" colSpan={5}>
                                    {t('creators.noResults')}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};
