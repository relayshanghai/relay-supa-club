import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { CreatorSearchAccountObject } from 'types';
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
                <thead className="bg-white sticky top-0">
                    <tr>
                        <th className="w-2/4 px-4 py-4 text-xs text-gray-500 font-normal text-left">
                            {t('creators.account')}
                        </th>
                        <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                            {t('creators.subscribers')}
                        </th>
                        <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                            {t('creators.engagements')}
                        </th>
                        <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                            {t('creators.engagementRate')}
                        </th>
                        <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                            {t('creators.avgViews')}
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {usageExceeded ? (
                        <tr>
                            <td className="text-center py-4 space-y-4" colSpan={5}>
                                <p className="mb-4">{t('creators.usageExceeded')}</p>
                                <Link href="/pricing">
                                    <a>
                                        <Button>
                                            {t('account.subscription.upgradeSubscription')}
                                        </Button>
                                    </a>
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
                            <td className="text-center py-4" colSpan={5}>
                                {t('creators.noResults')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
