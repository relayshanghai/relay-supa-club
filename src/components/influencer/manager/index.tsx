import Fuse from 'fuse.js';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileOverlayScreen } from 'src/components/influencer-profile/screens/profile-overlay-screen';
import { useUiState } from 'src/components/influencer-profile/screens/profile-screen-context';
import type { CommonStatusType, MultipleDropdownObject } from 'src/components/library';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequences } from 'src/hooks/use-sequences';
import { useUser } from 'src/hooks/use-user';
import { OpenInfluencerManagerPage } from 'src/utils/analytics/events';
import { COLLAB_OPTIONS } from '../constants';
import { CollabStatus } from './collab-status';
import { filterByMe } from './helpers';
import { OnlyMe } from './onlyme';
import { SearchComponent } from './search-component';
import { Table } from './table';
import { inManagerDummyInfluencers } from 'src/components/sequences/in-manager-dummy-sequence-influencers';

const Manager = () => {
    const { sequences } = useSequences();
    const { refreshSequenceInfluencers } = useSequenceInfluencers(
        sequences?.map((sequence) => {
            return sequence.id;
        }),
    );
    const sequenceInfluencers = inManagerDummyInfluencers;

    const { profile } = useUser();

    const { t } = useTranslation();

    const [influencer, setInfluencer] = useState<SequenceInfluencerManagerPage | null>(null);
    const [uiState, setUiState] = useUiState();
    const [influencers, setInfluencers] = useState<SequenceInfluencerManagerPage[] | undefined>(sequenceInfluencers);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [onlyMe, setOnlyMe] = useState<boolean>(false);
    const [filterStatuses, setFilterStatuses] = useState<CommonStatusType[]>([]);

    const { track } = useRudderstackTrack();

    useEffect(() => {
        const { abort } = track(OpenInfluencerManagerPage);
        return abort;
    }, [track]);

    const handleRowClick = useCallback(
        (influencer: SequenceInfluencerManagerPage) => {
            setInfluencer(influencer);

            setUiState((s) => {
                return { ...s, isProfileOverlayOpen: true };
            });
        },
        [setUiState],
    );

    const handleProfileUpdate = useCallback(() => {
        refreshSequenceInfluencers();
    }, [refreshSequenceInfluencers]);

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
        if (!sequenceInfluencers || sequenceInfluencers.length <= 0) {
            return;
        }
        setCollabOptions(setCollabStatusValues(sequenceInfluencers, COLLAB_OPTIONS));
    }, [sequenceInfluencers]);

    const handleSetSearch = useCallback(
        (term: string) => {
            setSearchTerm(term);
            if (!sequenceInfluencers) {
                return;
            }
            const fuse = new Fuse(sequenceInfluencers, {
                minMatchCharLength: 1,
                keys: ['fullname', 'username'],
            });

            if (term.length === 0) {
                setInfluencers(sequenceInfluencers);
                return;
            }

            setInfluencers(fuse.search(term).map((result) => result.item));
        },
        [sequenceInfluencers],
    );

    const handleOnlyMe = useCallback(
        (state: boolean) => {
            setOnlyMe(!onlyMe);
            if (!sequenceInfluencers || !profile || !sequences) {
                return;
            }

            if (!state) {
                setInfluencers(sequenceInfluencers);
                return;
            }

            setInfluencers(filterByMe(sequenceInfluencers, profile, sequences));
        },
        [onlyMe, sequenceInfluencers, profile, sequences],
    );

    const handleStatus = useCallback(
        (filters: CommonStatusType[]) => {
            setFilterStatuses(filters);
            if (!sequenceInfluencers) {
                return;
            }

            if (filters.length === 0) {
                setInfluencers(sequenceInfluencers);
                return;
            }

            setInfluencers(sequenceInfluencers.filter((x) => filters.includes(x.funnel_status)));
        },
        [sequenceInfluencers, setFilterStatuses],
    );

    const handleProfileOverlayClose = useCallback(() => {
        setUiState((s) => {
            return { ...s, isProfileOverlayOpen: false };
        });

        setInfluencer(null);
    }, [setUiState]);

    return (
        <>
            <div className="m-8 flex flex-col">
                <div className="my-4 text-3xl font-semibold">
                    <h1>{t('manager.title')}</h1>
                </div>
                {/* Filters */}
                <div className="mt-[72px] flex flex-row justify-between">
                    <section className="flex flex-row gap-5">
                        <SearchComponent
                            searchTerm={searchTerm}
                            placeholder={t('manager.search')}
                            onSetSearch={handleSetSearch}
                        />
                        <CollabStatus
                            collabOptions={collabOptions}
                            filters={filterStatuses}
                            onSetFilters={handleStatus}
                        />
                    </section>
                    <OnlyMe state={onlyMe} onSwitch={handleOnlyMe} />
                </div>
                {/* Table */}
                <Table influencers={influencers} onRowClick={handleRowClick} />
            </div>
            <ProfileOverlayScreen
                profile={influencer}
                isOpen={uiState.isProfileOverlayOpen}
                onClose={handleProfileOverlayClose}
                onUpdate={handleProfileUpdate}
            />
        </>
    );
};

export default Manager;
