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
import { IQDATA_MAINTENANCE } from 'src/constants';
import { MaintenanceMessage } from '../maintenance-message';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { InfluencerAlreadyAddedModal } from '../influencer-already-added';
import { MoreResultsRows } from './search-result-row';
import ClientRoleWarning from './client-role-warning';
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { useRudderstack } from 'src/hooks/use-rudderstack';

export const SearchPageInner = ({ companyId }: { companyId?: string }) => {
    const { t } = useTranslation();
    const { platform, loading } = useSearch();
    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<CreatorSearchAccountObject | null>(null);
    const { campaigns } = useCampaigns({ companyId });
    const { trackEvent } = useRudderstack();

    const [page, setPage] = useState(0);
    const { results: firstPageSearchResults, resultsTotal, noResults, error, isValidating } = useSearchResults(0);

    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);
    const [campaignsWithCreator, setCampaignsWithCreator] = useState<string[]>([]);

    return (
        <div className="space-y-4">
            <ClientRoleWarning />
            <SelectPlatform />

            <SearchOptions setPage={setPage} setShowFiltersModal={setShowFiltersModal} />

            <div className="flex items-center">
                <div className="text-sm font-bold">{`${t('creators.results')}: ${numberFormatter(resultsTotal)}`}</div>
            </div>

            <SearchResultsTable
                setSelectedCreator={setSelectedCreator}
                setShowCampaignListModal={setShowCampaignListModal}
                setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                campaigns={campaigns}
                setCampaignsWithCreator={setCampaignsWithCreator}
                loading={loading}
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
                                campaigns={campaigns}
                                setCampaignsWithCreator={setCampaignsWithCreator}
                            />
                        ))}
                    </>
                }
            />

            {!noResults && (
                <Button
                    onClick={async () => {
                        setPage(page + 1);
                        trackEvent('load more');
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

export const SearchPage = () => {
    const { companyId } = useAtomValue(clientRoleAtom);

    return (
        <Layout>
            {IQDATA_MAINTENANCE ? (
                <MaintenanceMessage />
            ) : (
                <div className="flex flex-col p-6">
                    <SearchProvider>
                        <SearchPageInner companyId={companyId !== '' ? companyId : undefined} />
                    </SearchProvider>
                </div>
            )}
        </Layout>
    );
};

export default SearchPage;
