import { useCallback, useState } from 'react';
import { Button } from 'src/components/button';
import { SearchProvider, useSearch, useSearchResults } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import type { CreatorSearchAccountObject } from 'types';
import { useTranslation } from 'react-i18next';
import { AddToCampaignModal } from 'src/components/modal-add-to-campaign';
import { SelectPlatform } from './search-select-platform';
import { SearchResultsTable } from './search-results-table';
import { SearchFiltersModal } from './search-filters-modal';
import { SearchOptions } from './search-options';
import { Layout } from '../layout';
import { IQDATA_MAINTENANCE } from 'src/constants';
import { MaintenanceMessage } from '../maintenance-message';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { InfluencerAlreadyAddedModal } from '../influencer-already-added';
import ClientRoleWarning from './client-role-warning';
import { useAllCampaignCreators } from 'src/hooks/use-all-campaign-creators';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SearchCreators } from './search-creators';
import { SEARCH_RESULT } from 'src/utils/rudderstack/event-names';
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
// import { featRecommended } from 'src/constants/feature-flags';

export const SearchPageInner = () => {
    const { t } = useTranslation();
    const { platform, searchParams, setPage } = useSearch();
    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<CreatorSearchAccountObject | null>(null);
    const { campaigns } = useCampaigns({});
    const { allCampaignCreators } = useAllCampaignCreators(campaigns);
    const { trackEvent } = useRudderstack();

    const {
        results: firstPageSearchResults,
        resultsTotal,
        noResults,
        error,
        isValidating,
        loading: resultsLoading,
        search,
    } = useSearchResults();

    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);

    const handleSearch = useCallback(
        (params?: Partial<FetchCreatorsFilteredParams>) => {
            search({ ...searchParams, ...(params ?? {}) });
        },
        [search, searchParams],
    );

    // Trigger a search when platform is changed
    const handlePlatformChange = useCallback(() => {
        handleSearch();
    }, [handleSearch]);

    const handleLoadMore = useCallback(() => {
        const page = (searchParams?.page ?? 0) + 1;
        setPage(page);
        handleSearch({ page });
        trackEvent(SEARCH_RESULT('load more'));
    }, [trackEvent, handleSearch, searchParams, setPage]);

    return (
        <div className="space-y-4">
            <ClientRoleWarning />
            <div className="flex justify-between">
                <SelectPlatform onSelect={handlePlatformChange} />
                <div className="w-fit">
                    <SearchCreators platform={platform} />
                </div>
            </div>

            <SearchOptions setPage={setPage} setShowFiltersModal={setShowFiltersModal} onSearch={handleSearch} />

            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{`${t('creators.resultsPrefix')} ${numberFormatter(
                    resultsTotal,
                )} ${
                    platform === 'youtube' ? t('creators.resultsPostfixKeywords') : t('creators.resultsPostfixHashtags')
                }`}</div>
            </div>

            <SearchResultsTable
                setSelectedCreator={setSelectedCreator}
                setShowCampaignListModal={setShowCampaignListModal}
                setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                allCampaignCreators={allCampaignCreators}
                loading={resultsLoading}
                validating={isValidating}
                results={firstPageSearchResults}
                error={error}
            />

            {!noResults && <Button onClick={handleLoadMore}>{t('creators.loadMore')}</Button>}

            <AddToCampaignModal
                show={showCampaignListModal}
                setShow={setShowCampaignListModal}
                platform={platform}
                selectedCreator={{
                    ...selectedCreator?.account.user_profile,
                }}
                campaigns={campaigns}
                allCampaignCreators={allCampaignCreators}
            />

            <InfluencerAlreadyAddedModal
                show={showAlreadyAddedModal}
                setCampaignListModal={setShowCampaignListModal}
                setShow={setShowAlreadyAddedModal}
                selectedCreatorUserId={selectedCreator?.account.user_profile.user_id}
                campaigns={campaigns}
                allCampaignCreators={allCampaignCreators}
            />

            <SearchFiltersModal show={filterModalOpen} setShow={setShowFiltersModal} onSearch={handleSearch} />
        </div>
    );
};

export const SearchPage = () => {
    return (
        <Layout>
            {IQDATA_MAINTENANCE ? (
                <MaintenanceMessage />
            ) : (
                <div className="flex flex-col p-6">
                    <SearchProvider>
                        <SearchPageInner />
                    </SearchProvider>
                </div>
            )}
        </Layout>
    );
};

export default SearchPage;
