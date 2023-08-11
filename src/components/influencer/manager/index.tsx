import { useState, useCallback } from 'react';
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
import { COLLABOPTIONS } from '../constants';
import type { InfluencerRowProps } from './influencer-row';
import { ProfileOverlayScreen } from 'src/components/influencer-profile/screens/profile-overlay-screen';

const Manager = () => {
    const { sequences } = useSequences();
    const { sequenceInfluencers } = useSequenceInfluencers(
        sequences?.map((sequence) => {
            return sequence.id;
        }),
    );

    const { profile } = useUser();

    const [influencers, setInfluencers] = useState(sequenceInfluencers);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [onlyMe, setOnlyMe] = useState<boolean>(false);
    const [filterStatuses, setFilterStatuses] = useState<FunnelStatus[]>([]);
    const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
    const [_influencer, setInfluencer] = useState(null);

    const handleRowClick = useCallback((influencer: InfluencerRowProps['influencer']) => {
        // eslint-disable-next-line no-console
        console.log('on open > ', influencer);
        setInfluencer(influencer);
        setIsProfileOverlayOpen(true);
    }, []);

    const handleProfileUpdate = useCallback((data: any) => {
        // eslint-disable-next-line no-console
        console.log('on update > ', data);
    }, []);

    const setCollabStatusValues = (influencers: SequenceInfluencerManagerPage[], options: MultipleDropdownObject) => {
        const collabOptionsWithValue = options;
        Object.keys(COLLABOPTIONS).forEach((option) => {
            collabOptionsWithValue[option as FunnelStatus] = {
                ...options[option as FunnelStatus],
                value: influencers?.filter((x) => x.funnel_status === option).length || 0,
            };
        });

        return collabOptionsWithValue;
    };

    const [collabOptions, setCollabOptions] = useState(COLLABOPTIONS);

    useEffect(() => {
        if (!sequenceInfluencers) return;
        setCollabOptions(setCollabStatusValues(sequenceInfluencers, COLLABOPTIONS));
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

    return (
        <>
            <div className="m-8 flex flex-col">
                <div className="my-4 text-3xl font-semibold">
                    <h1>Influencer Manager</h1>
                </div>
                {/* Filters */}
                <div className="mt-[72px] flex flex-row justify-between">
                    <div className="flex flex-row gap-5">
                        <SearchComponent searchTerm={searchTerm} onSetSearch={handleSetSearch} />
                        <CollabStatus collabOptions={collabOptions} filters={filterStatuses} onSetFilters={handleStatus} />
                    </div>
                    <OnlyMe state={onlyMe} onSwitch={handleOnlyMe} />
                </div>
                {/* Table */}
                <Table influencers={influencers} />
            </div>
            <ProfileOverlayScreen
                isOpen={isProfileOverlayOpen}
                onClose={() => setIsProfileOverlayOpen(false)}
                onUpdate={handleProfileUpdate}
            />
        </>
    );
};

export default Manager;
