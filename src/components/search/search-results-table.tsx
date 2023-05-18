import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import type { CreatorSearchAccountObject } from 'types';
import { Button } from '../button';
import { SkeletonSearchResultRow } from '../common/skeleton-search-result-row';
import { SearchResultRow } from './search-result-row';
import type { CampaignCreatorBasicInfo } from 'src/utils/client-db/campaignCreators';

export interface SearchResultsTableProps {
    setShowCampaignListModal: (show: boolean) => void;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowAlreadyAddedModal: (show: boolean) => void;
    allCampaignCreators?: CampaignCreatorBasicInfo[];
    results?: CreatorSearchAccountObject[];
    loading: boolean;
    validating: boolean;
    moreResults?: JSX.Element;
    error: any;
}

export const SearchResultsTable = ({
    setShowCampaignListModal,
    setSelectedCreator,
    setShowAlreadyAddedModal,
    allCampaignCreators,
    results,
    loading: resultsLoading,
    validating,
    // moreResults,
    error,
}: SearchResultsTableProps) => {
    const { t } = useTranslation();
    const { usageExceeded, loading: topSearchLoading } = useSearch();
    const noResults = !results || results.length === 0;

    const loading = resultsLoading || topSearchLoading || validating;

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
                    {!error &&
                        !usageExceeded &&
                        loading &&
                        [...Array(10)].map((_, i) => <SkeletonSearchResultRow key={i} delay={i * 200} />)}

                    {!error && !usageExceeded && noResults && (
                        <tr>
                            <td className="py-4 text-center" colSpan={5}>
                                {t('creators.noResults')}
                            </td>
                            <td />
                        </tr>
                    )}
                    {!error && !usageExceeded && !noResults && results && (
                        <>
                            {results.map((creator, i) => (
                                <SearchResultRow
                                    key={i}
                                    creator={creator}
                                    setShowCampaignListModal={setShowCampaignListModal}
                                    setSelectedCreator={setSelectedCreator}
                                    setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                                    allCampaignCreators={allCampaignCreators}
                                />
                            ))}
                            {/* {moreResults} */}
                        </>
                    )}

                    {error && (
                        <tr>
                            <td className="py-4 text-center" colSpan={5}>
                                {t('creators.searchResultError')}
                            </td>
                            <td />
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
