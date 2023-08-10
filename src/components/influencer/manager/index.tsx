import { useState, useCallback } from 'react';
import { SearchComponent } from './search-component';
import { CollabStatus } from './collab-status';
import { OnlyMe } from './onlyme';
import { Table } from './table';
import { ProfileOverlayScreen } from 'src/components/influencer-profile/screens/profile-overlay-screen';
import type { InfluencerRowProps } from './influencer-row';

const Manager = () => {
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

    return (
        <>
            <div className="m-8 flex flex-col">
                <div className="my-4 text-3xl font-semibold">
                    <h1>Influencer Manager</h1>
                </div>
                {/* Filters */}
                <div className="mt-[72px] flex flex-row justify-between">
                    <div className="flex flex-row gap-5">
                        <SearchComponent />
                        <CollabStatus />
                    </div>
                    <OnlyMe />
                </div>
                {/* Table */}
                <Table onRowClick={handleRowClick} />
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
