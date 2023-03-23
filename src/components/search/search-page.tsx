import { useState } from 'react';
import { Button } from 'src/components/button';
import { SearchProvider, useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import type { CreatorSearchAccountObject } from 'types';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'src/components/icons';
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

const Search = ({ companyId }: { companyId?: string }) => {
    const { t } = useTranslation();
    const { company_name } = useRouter().query;
    const { platform, resultsTotal, search, noResults } = useSearch();

    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<CreatorSearchAccountObject | null>(null);
    const { campaigns } = useCampaigns({ companyId });

    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);
    const [campaignsWithCreator, setCampaignsWithCreator] = useState<string[]>([]);

    return (
        <div className="space-y-4">
            {companyId && (
                <div className="absolute top-5 right-36 z-50 animate-bounce rounded-md bg-red-400 p-2 text-white">{`You are acting on behalf of company: ${company_name}`}</div>
            )}
            <SelectPlatform />

            <SearchOptions setPage={setPage} setShowFiltersModal={setShowFiltersModal} />

            <div className="flex items-center">
                <div className="text-sm font-bold">
                    {`${t('creators.results')}: ${numberFormatter(resultsTotal)}`}
                </div>
            </div>

            <SearchResultsTable
                setSelectedCreator={setSelectedCreator}
                setShowCampaignListModal={setShowCampaignListModal}
                setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                campaigns={campaigns}
                setCampaignsWithCreator={setCampaignsWithCreator}
            />

            {loadingMore && (
                <div className="flex w-full justify-center p-10">
                    <Spinner className="h-12 w-12 fill-primary-600 text-white" />
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
                        <Search companyId={companyId} />
                    </SearchProvider>
                </div>
            )}
        </Layout>
    );
};

export default SearchPage;
