import { useCallback, useState } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';

type Props = {
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onUpdate?: (data: Partial<ProfileValue>) => void;
};

export const ProfileOverlayScreen = (props: Props) => {
    const [profile] = useState({
        username: 'TastyChef',
        platform: 'instagram',
        name: "D'Jon Curtis",
        avatar: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=TastyChef&size=96',
    });

    const handleClose = useCallback(() => {
        props.onClose && props.onClose();

        // eslint-disable-next-line no-console
        console.log('overlay closed!');
    }, [props]);

    const handleOpen = useCallback(() => {
        props.onOpen && props.onOpen();

        // eslint-disable-next-line no-console
        console.log('overlay opened!');
    }, [props]);

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            props.onUpdate && props.onUpdate(data);
            handleClose();

            // eslint-disable-next-line no-console
            console.log('overlay update!');
        },
        [props, handleClose],
    );

    return (
        <>
            <OverlayRight isOpen={props.isOpen} onClose={handleClose} onOpen={handleOpen}>
                <ProfileScreen profile={profile} onCancel={handleClose} onUpdate={handleUpdate} />
            </OverlayRight>
        </>
    );
};
