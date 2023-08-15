import { SearchComponent } from './search-component';
import { CollabStatus } from './collab-status';
import { OnlyMe } from './onlyme';
import { Table } from './table';
import { useSequences } from 'src/hooks/use-sequences';
import { type SequenceInfluencerManagerPage, useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { useUser } from 'src/hooks/use-user';
import { type FunnelStatus } from 'src/utils/api/db';
import { type MultipleDropdownObject } from 'src/components/library';
import { COLLAB_OPTIONS } from '../constants';
import { ProfileOverlayScreen } from 'src/components/influencer-profile/screens/profile-overlay-screen';
import { useTranslation } from 'react-i18next';
import { useUiState } from 'src/components/influencer-profile/screens/profile-screen-context';

const Manager = () => {
    const { sequences } = useSequences();
    const { sequenceInfluencers } = useSequenceInfluencers(
        sequences?.map((sequence) => {
            return sequence.id;
        }),
    );

    const { profile } = useUser();

    const { t } = useTranslation();

    const [influencer, setInfluencer] = useState<SequenceInfluencerManagerPage | null>(null);
    const [uiState, setUiState] = useUiState();
    const [influencers, setInfluencers] = useState<SequenceInfluencerManagerPage[] | undefined>(sequenceInfluencers);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [onlyMe, setOnlyMe] = useState<boolean>(false);
    const [filterStatuses, setFilterStatuses] = useState<FunnelStatus[]>([]);

    const handleRowClick = useCallback(
        (_influencer: SequenceInfluencerManagerPage) => {
            setInfluencer((s) => {
                // @todo influencer is sometimes null?
                if (!s) return s;

                return {
                    ...s,
                    username: 'TastyChef',
                    // @todo platform needed in influencer type
                    platform: 'instagram',
                    name: "D'Jon Curtis",
                    // @todo change avatar to avatar_url
                    avatar: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=TastyChef&size=96',
                };
            });

            setUiState((s) => {
                return { ...s, isProfileOverlayOpen: true };
            });
        },
        [setUiState],
    );

    const handleProfileUpdate = useCallback((data: any) => {
        // eslint-disable-next-line no-console
        console.log('@todo update influencer profile', data);
    }, []);

    const setCollabStatusValues = (influencers: SequenceInfluencerManagerPage[], options: MultipleDropdownObject) => {
        const collabOptionsWithValue = options;
        Object.keys(COLLAB_OPTIONS).forEach((option) => {
            collabOptionsWithValue[option as FunnelStatus] = {
                ...options[option as FunnelStatus],
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
            if (!sequenceInfluencers) {
                return;
            }

            if (!state) {
                setInfluencers(sequenceInfluencers);
                return;
            }

            setInfluencers(sequenceInfluencers.filter((x) => x.manager_first_name === profile?.first_name));
        },
        [sequenceInfluencers, profile, onlyMe],
    );

    const handleStatus = useCallback(
        (filters: FunnelStatus[]) => {
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
                    <div className="flex flex-row gap-5">
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
                    </div>
                    <OnlyMe state={onlyMe} onSwitch={handleOnlyMe} />
                </div>
                {/* Table */}
                <Table influencers={influencers} onRowClick={handleRowClick} />
            </div>
            <ProfileOverlayScreen
                // @todo influencer is now SequenceInfluencerManagerPage
                // @ts-ignore
                profile={influencer}
                isOpen={uiState.isProfileOverlayOpen}
                onClose={handleProfileOverlayClose}
                onUpdate={handleProfileUpdate}
            />
        </>
    );
};

export default Manager;
