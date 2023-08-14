import { useCallback, useState } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreenProvider, useUiState } from './profile-screen-context';
import type { Profile } from '../components/profile-header';
import { NotesListOverlayScreen } from './notes-list-overlay';

type Props = {
    profile: Profile | null;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onUpdate?: (data: Partial<ProfileValue>) => void;
};

export const ProfileOverlayScreen = ({ profile, onOpen, ...props }: Props) => {
    const [uiState, setUiState] = useUiState();

    const [initialValue] = useState({
        notes: {
            collabStatus: '',
            nextStep: '',
            fee: '',
            videoDetails: '',
            affiliateLink: '',
            scheduledPostDate: '',
            notes: '',
        },
        shippingDetails: {
            name: '',
            phoneNumber: '',
            streetAddress: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            trackingCode: '',
            fullAddress: '',
        },
    });

    const handleClose = useCallback(() => {
        props.onClose && props.onClose();
    }, [props]);

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            props.onUpdate && props.onUpdate(data);
            handleClose();

            // eslint-disable-next-line no-console
            console.log('overlay update!', data);
        },
        [props, handleClose],
    );

    return (
        <>
            <OverlayRight isOpen={props.isOpen} onClose={handleClose} onOpen={() => onOpen && onOpen()}>
                <ProfileScreenProvider initialValue={initialValue}>
                    {profile ? (
                        <ProfileScreen profile={profile} onCancel={handleClose} onUpdate={handleUpdate} />
                    ) : null}
                </ProfileScreenProvider>
            </OverlayRight>

            <NotesListOverlayScreen
                isOpen={uiState.isNotesListOverlayOpen}
                onClose={() =>
                    setUiState((s) => {
                        return { ...s, isNotesListOverlayOpen: false };
                    })
                }
            />
        </>
    );
};
