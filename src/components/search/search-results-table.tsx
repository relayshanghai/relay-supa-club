import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import type { CreatorSearchAccountObject } from 'types';
import { Button } from '../button';
import { SkeletonSearchResultRow } from '../common/skeleton-search-result-row';
import { SearchResultRow } from './search-result-row';

export const SearchResultsTable = ({
    setShowCampaignListModal,
    setSelectedCreator,
}: {
    setShowCampaignListModal: (show: boolean) => void;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
}) => {
    const { t } = useTranslation();
    const { loading, resultPages, usageExceeded, noResults } = useSearch();
    return (
        <div className="w-full overflow-auto">
            <table
                className={`min-w-full divide-y divide-gray-200 rounded-lg shadow ${
                    loading ? 'opacity-60' : ''
                }`}
            >
                <thead className="sticky top-0 bg-white">
                    <tr>
                        <th className="w-2/4 px-4 py-4 text-left text-xs font-normal text-gray-500">
                            {t('creators.account')}
                        </th>
                        <th className="whitespace-nowrap pr-4 text-left text-xs font-normal text-gray-500">
                            {t('creators.subscribers')}
                        </th>
                        <th className="whitespace-nowrap pr-4 text-left text-xs font-normal text-gray-500">
                            {t('creators.engagements')}
                        </th>
                        <th className="whitespace-nowrap pr-4 text-left text-xs font-normal text-gray-500">
                            {t('creators.engagementRate')}
                        </th>
                        <th className="whitespace-nowrap pr-4 text-left text-xs font-normal text-gray-500">
                            {t('creators.avgViews')}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {usageExceeded ? (
                        <tr>
                            <td className="space-y-4 py-4 text-center" colSpan={5}>
                                <p className="mb-4">{t('creators.usageExceeded')}</p>
                                <Link href="/pricing">
                                    <Button>{t('account.subscription.upgradeSubscription')}</Button>
                                </Link>
                            </td>
                        </tr>
                    ) : !noResults ? (
                        resultPages?.map((page) =>
                            page?.map((creator, i) => (
                                <SearchResultRow
                                    key={i}
                                    creator={creator}
                                    setShowCampaignListModal={setShowCampaignListModal}
                                    setSelectedCreator={setSelectedCreator}
                                />
                            )),
                        )
                    ) : loading ? (
                        [...Array(10)].map((_, i) => (
                            <SkeletonSearchResultRow key={i} delay={i * 200} />
                        ))
                    ) : (
                        <tr>
                            <td className="py-4 text-center" colSpan={5}>
                                {t('creators.noResults')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
