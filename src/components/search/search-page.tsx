/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Button } from 'src/components/button';
import { SearchProvider, useSearch } from 'src/hooks/use-search';
import { formatter } from 'src/utils/formatter';
import { CreatorSearchAccountObject } from 'types';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'src/components/icons';
import { AddToCampaignModal } from 'src/components/modal-add-to-campaign';
import { SelectPlatform } from './search-select-platform';
import { SearchResultsTable } from './search-results-table';
import { SearchFiltersModal } from './search-filters-modal';
import { SearchOptions } from './search-options';
import { Layout } from '../layout';
import { useRouter } from 'next/router';

const Search = ({ companyId }: { companyId?: string }) => {
    const { t } = useTranslation();
    const { company_name } = useRouter().query;
    const { platform, resultsTotal, search, noResults } = useSearch();

    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<CreatorSearchAccountObject | null>(null);

    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    return (
        <div className="space-y-4">
            {companyId && (
                <div className="absolute z-50 bg-red-400 text-white top-5 right-36 p-2 rounded-md animate-bounce">{`You are acting on behalf of company: ${company_name}`}</div>
            )}
            <SelectPlatform />

            <SearchOptions setPage={setPage} setShowFiltersModal={setShowFiltersModal} />

            <div className="flex items-center">
                <div className="font-bold text-sm">
                    {`${t('creators.results')}: ${formatter(resultsTotal)}`}
                </div>
            </div>

            <SearchResultsTable
                setSelectedCreator={setSelectedCreator}
                setShowCampaignListModal={setShowCampaignListModal}
            />

            {loadingMore && (
                <div className="w-full flex justify-center p-10">
                    <Spinner className="fill-primary-600 text-white w-12 h-12" />
                </div>
            )}
            {!loadingMore && !noResults && (
                <Button
                    onClick={async () => {
                        setLoadingMore(true);
                        await search({ page: page + 1 });
                        setLoadingMore(false);
                        setPage(page + 1);
                    }}
                >
                    {t('creators.loadMore')}
                </Button>
            )}
            <AddToCampaignModal
                show={showCampaignListModal}
                setShow={setShowCampaignListModal}
                platform={platform}
                selectedCreator={{
                    ...selectedCreator?.account.user_profile,
                }}
                companyId={companyId}
            />
            <SearchFiltersModal show={filterModalOpen} setShow={setShowFiltersModal} />
        </div>
    );
};

export const SearchPage = ({ companyId }: { companyId?: string }) => {
    return (
        <Layout>
            <div className="flex flex-col p-6">
                <SearchProvider>
                    <Search companyId={companyId} />
                </SearchProvider>
            </div>
        </Layout>
    );
};

export default SearchPage;
