import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { Button } from '../button';
import { SkeletonSearchResultRow } from '../common/skeleton-search-result-row';
import { SearchResultRow } from './search-result-row';
import type { CampaignCreatorBasicInfo } from 'src/utils/api/db/calls/campaignCreators';
import type { AllSequenceInfluencersBasicInfo } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import { useCompany } from 'src/hooks/use-company';
import type { SearchTableInfluencer as ClassicSearchInfluencer } from 'types';

export interface SearchResultsTableProps {
    setShowCampaignListModal: (show: boolean) => void;
    setSelectedCreator: (creator: ClassicSearchInfluencer) => void;
    setShowAlreadyAddedModal: (show: boolean) => void;
    allCampaignCreators?: CampaignCreatorBasicInfo[];
    allSequenceInfluencersIqDataIdsAndSequenceNames?: AllSequenceInfluencersBasicInfo[];
    results?: ClassicSearchInfluencer[];
    loading: boolean;
    validating: boolean;
    moreResults?: JSX.Element;
    error: any;
    batchId: number;
}

// eslint-disable-next-line complexity
export const SearchResultsTable = ({
    setShowCampaignListModal,
    setSelectedCreator,
    setShowAlreadyAddedModal,
    allCampaignCreators,
    allSequenceInfluencersIqDataIdsAndSequenceNames,
    results,
    loading: resultsLoading,
    validating,
    moreResults,
    error,
    batchId,
}: SearchResultsTableProps) => {
    const { t } = useTranslation();
    const { usageExceeded, loading: topSearchLoading } = useSearch();
    const { isExpired } = useCompany();
    const noResults = !results || results.length === 0;

    const loading = resultsLoading || topSearchLoading || (noResults && validating);

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
                                <Link href="/upgrade">
                                    <Button>{t('account.subscription.upgradeSubscription')}</Button>
                                </Link>
                            </td>
                        </tr>
                    )}
                    {isExpired && (
                        <tr className="w-full">
                            <td className="space-y-4 py-4 text-center" colSpan={6}>
                                <p className="mb-4">{t('creators.accountExpired')}</p>
                                <Link href="/upgrade">
                                    <Button>{t('account.subscription.upgradeSubscription')}</Button>
                                </Link>
                            </td>
                        </tr>
                    )}
                    {!error &&
                        !usageExceeded &&
                        noResults &&
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
                    {!error && !usageExceeded && !noResults && results && !isExpired && (
                        <>
                            {results.map((creator, i) => (
                                <SearchResultRow
                                    key={`${creator.username}-${creator.user_id}`}
                                    creator={creator}
                                    setShowCampaignListModal={setShowCampaignListModal}
                                    setSelectedCreator={setSelectedCreator}
                                    setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                                    allCampaignCreators={allCampaignCreators}
                                    allSequenceInfluencersIqDataIdsAndSequenceNames={
                                        allSequenceInfluencersIqDataIdsAndSequenceNames
                                    }
                                    batchId={batchId}
                                    page={1}
                                    resultIndex={i}
                                />
                            ))}
                            {moreResults}
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
