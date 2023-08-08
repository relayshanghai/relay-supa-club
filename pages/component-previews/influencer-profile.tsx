import { OverlayRight } from '../../src/components/influencer-profile/components/overlay-right';
import { ProfileScreen } from '../../src/components/influencer-profile/screens/profile-screen';

export default function ComponentStage() {
    return (
        <>
            <OverlayRight>
                <ProfileScreen />
            </OverlayRight>
        </>
    );
}
