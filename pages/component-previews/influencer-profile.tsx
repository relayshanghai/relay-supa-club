import { useCallback, useState } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';

export default function ComponentStage() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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
                <ProfileScreen />
            </OverlayRight>
        </>
    );
}
