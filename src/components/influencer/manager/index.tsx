import { useState, useCallback } from 'react';
import { SearchComponent } from './search-component';
import { CollabStatus } from './collab-status';
import { OnlyMe } from './onlyme';
import { Table } from './table';
import { ProfileOverlayScreen } from 'src/components/influencer-profile/screens/profile-overlay-screen';
import type { InfluencerRowProps } from './influencer-row';
import type { Profile } from 'src/components/influencer-profile/components/profile-header';
import { useUiState } from 'src/components/influencer-profile/screens/profile-screen-context';

const Manager = () => {
    const [influencer, setInfluencer] = useState<Profile | null>(null);
    const [uiState, setUiState] = useUiState();

    const handleRowClick = useCallback(
        (_influencer: InfluencerRowProps['influencer']) => {
            setInfluencer({
                username: 'TastyChef',
                platform: 'instagram',
                name: "D'Jon Curtis",
                avatar: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=TastyChef&size=96',
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
                profile={influencer}
                isOpen={uiState.isProfileOverlayOpen}
                onClose={handleProfileOverlayClose}
                onUpdate={handleProfileUpdate}
            />
        </>
    );
};

export default Manager;
