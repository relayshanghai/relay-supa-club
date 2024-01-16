import type {
    SequenceInfluencerManagerPage,
    SequenceInfluencerManagerPageWithChannelData,
} from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiState } from 'src/components/influencer-profile/screens/profile-screen-context';
import { FaqModal, type CommonStatusType, type MultipleDropdownObject } from 'src/components/library';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequences } from 'src/hooks/use-sequences';
import { useUser } from 'src/hooks/use-user';
import { ClickNeedHelp, OpenInfluencerProfile } from 'src/utils/analytics/events';
import { COLLAB_OPTIONS } from '../constants';
import { CollabStatus } from './collab-status';
import { filterInfluencers } from './helpers';
import { OnlyMe } from './onlyme';
import { SearchComponent } from './search-component';
import { Table } from './table';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import { useRouter } from 'next/router';
import faq from 'i18n/en/faq';
import { Button } from 'src/components/button';
import { Question } from 'src/components/icons';
import { FilterInfluencerManager } from 'src/utils/analytics/events/outreach/filter-influencer-manager';
import { SearchInfluencerManager } from 'src/utils/analytics/events/outreach/search-influencer-manager';
import { ToggleViewMine } from 'src/utils/analytics/events/outreach/toggle-view-mine';
import { Sheet, SheetContent } from 'shadcn/components/ui/sheet';
import { useAddress } from 'src/hooks/use-address';

const Manager = () => {
    const { sequences } = useSequences();
    const { sequenceInfluencers, refreshSequenceInfluencers, loading } = useSequenceInfluencers(
        sequences && sequences.map((sequence) => sequence.id),
    );
    useEffect(() => {
        refreshSequenceInfluencers([]);
    }, [refreshSequenceInfluencers]);

    const { profile } = useUser();

    const { t } = useTranslation();

    const { push } = useRouter();

    const [influencer, setInfluencer] = useState<SequenceInfluencerManagerPageWithChannelData | null>(null);
    const [uiState, setUiState] = useUiState();
    const [showNeedHelp, setShowNeedHelp] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [onlyMe, setOnlyMe] = useState<boolean>(false);
    const [filterStatuses, setFilterStatuses] = useState<CommonStatusType[]>([]);

    const { track } = useRudderstackTrack();

    const influencers = useMemo(
        () =>
            sequenceInfluencers.length > 0 && profile && sequences
                ? filterInfluencers(searchTerm, onlyMe, filterStatuses, profile, sequenceInfluencers, sequences)
                : [],
        [sequenceInfluencers, profile, sequences, searchTerm, onlyMe, filterStatuses],
    );

    const { address } = useAddress(influencer?.influencer_social_profile_id);

    const handleRowClick = useCallback(
        (influencer: SequenceInfluencerManagerPageWithChannelData) => {
            if (!influencer.influencer_social_profile_id) {
                throw Error('No social profile id');
            }
            setInfluencer(influencer);

            setUiState((s) => {
                return { ...s, isProfileOverlayOpen: true };
            });

            track(OpenInfluencerProfile, {
                influencer_id: influencer.influencer_social_profile_id,
                current_status: influencer?.funnel_status,
                is_users_influencer: influencer.manager_first_name === profile?.first_name,
            });
        },
        [setUiState, track, profile],
    );

    const setCollabStatusValues = (influencers: SequenceInfluencerManagerPage[], options: MultipleDropdownObject) => {
        const collabOptionsWithValue = options;
        Object.keys(COLLAB_OPTIONS).forEach((option) => {
            collabOptionsWithValue[option as CommonStatusType] = {
                ...options[option as CommonStatusType],
                value: influencers.filter((x) => x.funnel_status === option).length || 0,
            };
        });

        return collabOptionsWithValue;
    };

    const [collabOptions, setCollabOptions] = useState(COLLAB_OPTIONS);

    useEffect(() => {
        if (!sequenceInfluencers) return;
        setCollabOptions(setCollabStatusValues(sequenceInfluencers, COLLAB_OPTIONS));
    }, [sequenceInfluencers]);

    const handleOnlyMe = useCallback(() => {
        track(ToggleViewMine, {
            action: !onlyMe ? 'Enable' : 'Disable',
            total_managed_influencers: influencers.length,
            total_users_influencers: influencers.filter(({ added_by }) => added_by === profile?.id).length,
        });
        setOnlyMe(!onlyMe);
    }, [influencers, onlyMe, profile?.id, track]);

    const handleFilterStatus = useCallback(
        (filters: CommonStatusType[]) => {
            setFilterStatuses(filters);
            track(FilterInfluencerManager, {
                filter_type: 'Status',
                selected_statuses: filters,
                view_mine_enabled: onlyMe,
                total_managed_influencers: influencers.length,
                total_filter_results: profile
                    ? filterInfluencers(searchTerm, onlyMe, filters, profile, sequenceInfluencers, sequences)?.length ||
                      0
                    : 0,
            });
        },
        [onlyMe, influencers, profile, searchTerm, sequenceInfluencers, sequences, track],
    );

    const handleSearch = useCallback(
        (term: string) => {
            setSearchTerm(term);
            const results = profile
                ? filterInfluencers(term, onlyMe, filterStatuses, profile, sequenceInfluencers, sequences)
                : null;
            track(SearchInfluencerManager, {
                query: term,
                total_results: results?.length || 0,
            });
        },
        [onlyMe, filterStatuses, profile, sequenceInfluencers, sequences, track],
    );

    const handleProfileOverlayClose = useCallback(() => {
        setUiState((s) => {
            return { ...s, isProfileOverlayOpen: false };
        });

        setInfluencer(null);
    }, [setUiState]);

    return (
        <Sheet open={uiState.isProfileOverlayOpen} onOpenChange={handleProfileOverlayClose}>
            <FaqModal
                title={t('faq.influencerManagerTitle')}
                description={t('faq.influencerManagerDescription')}
                visible={showNeedHelp}
                onClose={() => setShowNeedHelp(false)}
                content={faq.influencerManager.map((_, i) => ({
                    title: t(`faq.influencerManager.${i}.title`),
                    detail: t(`faq.influencerManager.${i}.detail`),
                }))}
                getMoreInfoButtonText={t('faq.influencerManagerGetMoreInfo') || ''}
                getMoreInfoButtonAction={() => push('/guide')}
                source="Influencer Manager"
            />
            <div className="mx-6 my-6 flex flex-col">
                <section className="flex w-full flex-row justify-between">
                    <div className="md:w-1/2">
                        <h1 className="mr-4 self-center text-3xl font-semibold text-gray-800">{t('manager.title')}</h1>
                        <h2 className="mt-2 text-gray-500">{t('manager.subtitle')}</h2>
                    </div>
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowNeedHelp(true);
                                track(ClickNeedHelp);
                            }}
                            className="flex items-center"
                        >
                            {t('website.needHelp')}
                            <Question className="ml-2 h-6 w-6" />
                        </Button>
                    </div>
                </section>
                {/* Filters */}
                <div className="mt-[72px] flex flex-row justify-between">
                    <section className="flex flex-row gap-5">
                        <SearchComponent
                            searchTerm={searchTerm}
                            placeholder={t('manager.search')}
                            onSetSearch={handleSearch}
                        />
                        <CollabStatus
                            collabOptions={collabOptions}
                            filters={filterStatuses}
                            onSetFilters={handleFilterStatus}
                        />
                    </section>
                    <OnlyMe state={onlyMe} onSwitch={handleOnlyMe} />
                </div>
                {/* Table */}
                <Table loading={loading} influencers={influencers} onRowClick={handleRowClick} />
            </div>
            <SheetContent className="max-w-lg overflow-y-auto p-0 xl:max-w-xl">
                {influencer && address && (
                    <ProfileScreen profile={influencer} influencerData={influencer.channel_data} address={address} />
                )}
            </SheetContent>
        </Sheet>
    );
};

export default Manager;
