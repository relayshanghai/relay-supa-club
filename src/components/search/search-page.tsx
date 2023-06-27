import { useEffect, useState } from 'react';
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
import { MoreResultsRows } from './search-result-row';
import ClientRoleWarning from './client-role-warning';
import { useAllCampaignCreators } from 'src/hooks/use-all-campaign-creators';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SearchCreators } from './search-creators';
// import { featRecommended } from 'src/constants/feature-flags';

export const SearchPageInner = () => {
    const { t } = useTranslation();
    const {
        platform,
        setSearchParams,
        // recommendedInfluencers,
        // onlyRecommended,
        setAudience,
        setViews,
        setGender,
        setEngagement,
        setLastPost,
        setContactInfo,
        setTopicTags,
        setInfluencerLocation,
        setAudienceLocation,
    } = useSearch();
    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<CreatorSearchAccountObject | null>(null);
    const { campaigns } = useCampaigns({});
    const { allCampaignCreators } = useAllCampaignCreators(campaigns);
    const { trackEvent } = useRudderstack();

    const [page, setPage] = useState(0);
    const {
        results: firstPageSearchResults,
        resultsTotal,
        noResults,
        error,
        isValidating,
        loading: resultsLoading,
    } = useSearchResults(0);

    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);

    // TODO:comment out the related codes when feat recommended is ready
    useEffect(() => {
        setSearchParams({
            page: 0,
            platform,
            username: '',
            views: [null, null],
            audience: [null, null],
            // recommendedInfluencers: featRecommended() ? recommendedInfluencers : [],
            // only_recommended: featRecommended() ? onlyRecommended : false,
        });
    }, [platform, setSearchParams]);

    useEffect(() => {
        setAudience([null, null]);
        setViews([null, null]);
        setGender(undefined);
        setEngagement(undefined);
        setLastPost(undefined);
        setContactInfo(undefined);
        setTopicTags([]);
        setInfluencerLocation([]);
        setAudienceLocation([]);
        setPage(0);
    }, [
        platform,
        setAudience,
        setAudienceLocation,
        setContactInfo,
        setEngagement,
        setGender,
        setInfluencerLocation,
        setLastPost,
        setTopicTags,
        setViews,
    ]);

    return (
        <div className="space-y-4">
            <ClientRoleWarning />
            <div className="flex justify-between">
                <SelectPlatform />
                <div className="w-fit">
                    <SearchCreators platform={platform} />
                </div>
            </div>

            <SearchOptions setPage={setPage} setShowFiltersModal={setShowFiltersModal} />

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
                moreResults={
                    <>
                        {new Array(page).fill(0).map((_, i) => (
                            <MoreResultsRows
                                key={i}
                                page={i + 1}
                                setSelectedCreator={setSelectedCreator}
                                setShowCampaignListModal={setShowCampaignListModal}
                                setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                                allCampaignCreators={allCampaignCreators}
                            />
                        ))}
                    </>
                }
            />

            {!noResults && (
                <Button
                    onClick={async () => {
                        setPage(page + 1);
                        trackEvent('Search Result, load more');
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

            <SearchFiltersModal show={filterModalOpen} setShow={setShowFiltersModal} />
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
