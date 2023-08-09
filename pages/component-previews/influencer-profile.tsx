import { useCallback, useState } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';

export default function ComponentStage() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(true);
    const [profile] = useState({
        username: 'TastyChef',
        platform: 'instagram',
        name: "D'Jon Curtis",
        avatar: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=TastyChef&size=96',
    });

    const toggleOverlay = useCallback(() => {
        setIsOverlayOpen((s) => !s);
    }, []);

    return (
        <>
            <button onClick={toggleOverlay} type="button">
                Toggle Overlay
            </button>

            <OverlayRight
                isOpen={isOverlayOpen}
                onClose={() => {
                    toggleOverlay();
                    // eslint-disable-next-line no-console
                    console.log('overlay closed!');
                }}
                onOpen={() => {
                    // eslint-disable-next-line no-console
                    console.log('overlay opened!');
                }}
            >
                <ProfileScreen
                    profile={profile}
                    onCancel={() => toggleOverlay()}
                    onUpdate={(data) => {
                        // eslint-disable-next-line no-console
                        console.log('update!', data);
                    }}
                />
            </OverlayRight>
        </>
    );
}
