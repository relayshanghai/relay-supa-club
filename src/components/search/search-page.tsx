import { useState } from 'react';
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
import { useRouter } from 'next/router';
import { IQDATA_MAINTENANCE } from 'src/constants';
import { MaintenanceMessage } from '../maintenance-message';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { InfluencerAlreadyAddedModal } from '../influencer-already-added';
import { MoreResultsRows } from './search-result-row';

export const SearchPageInner = ({ companyId }: { companyId?: string }) => {
    const { t } = useTranslation();
    const { company_name } = useRouter().query;
    const { platform, loading } = useSearch();
    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<CreatorSearchAccountObject | null>(null);
    const { campaigns } = useCampaigns({ companyId });

    const [page, setPage] = useState(0);
    const { results: firstPageSearchResults, resultsTotal, noResults, error } = useSearchResults(0);

    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);
    const [campaignsWithCreator, setCampaignsWithCreator] = useState<string[]>([]);
    const [onlyRecommended, setOnlyRecommended] = useState(false);

    return (
        <div className="space-y-4">
            {companyId && (
                <div className="absolute top-5 right-36 z-50 animate-bounce rounded-md bg-red-400 p-2 text-white">{`You are acting on behalf of company: ${company_name}`}</div>
            )}
            <SelectPlatform />

            <SearchOptions
                setPage={setPage}
                setShowFiltersModal={setShowFiltersModal}
                onlyRecommended={onlyRecommended}
                setOnlyRecommended={setOnlyRecommended}
            />

            <div className="flex items-center">
                <div className="text-sm font-bold">{`${t('creators.results')}: ${numberFormatter(resultsTotal)}`}</div>
            </div>

            <SearchResultsTable
                setSelectedCreator={setSelectedCreator}
                setShowCampaignListModal={setShowCampaignListModal}
                setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                campaigns={campaigns}
                setCampaignsWithCreator={setCampaignsWithCreator}
                onlyRecommended={onlyRecommended}
                loading={loading}
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
                                campaigns={campaigns}
                                setCampaignsWithCreator={setCampaignsWithCreator}
                                onlyRecommended={onlyRecommended}
                            />
                        ))}
                    </>
                }
            />

            {!noResults && <Button onClick={async () => setPage(page + 1)}>{t('creators.loadMore')}</Button>}

            <AddToCampaignModal
                show={showCampaignListModal}
                setShow={setShowCampaignListModal}
                platform={platform}
                selectedCreator={{
                    ...selectedCreator?.account.user_profile,
                }}
                campaigns={campaigns}
            />

            <InfluencerAlreadyAddedModal
                show={showAlreadyAddedModal}
                setCampaignListModal={setShowCampaignListModal}
                setShow={setShowAlreadyAddedModal}
                campaignsWithCreator={campaignsWithCreator}
            />

            <SearchFiltersModal show={filterModalOpen} setShow={setShowFiltersModal} />
        </div>
    );
};

export const SearchPage = ({ companyId }: { companyId?: string }) => {
    return (
        <Layout>
            {IQDATA_MAINTENANCE ? (
                <MaintenanceMessage />
            ) : (
                <div className="flex flex-col p-6">
                    <SearchProvider>
                        <SearchPageInner companyId={companyId} />
                    </SearchProvider>
                </div>
            )}
        </Layout>
    );
};

export default SearchPage;
