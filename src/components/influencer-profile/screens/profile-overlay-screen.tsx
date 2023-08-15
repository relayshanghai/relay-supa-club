import { useCallback, useMemo } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreenProvider, useUiState } from './profile-screen-context';
import { NotesListOverlayScreen } from './notes-list-overlay';
import type { SequenceInfluencerManagerPage } from 'src/hooks/use-sequence-influencers';

type Props = {
    profile: SequenceInfluencerManagerPage | null;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onUpdate?: (data: Partial<ProfileValue>) => void;
};

export const ProfileOverlayScreen = ({ profile, onOpen, ...props }: Props) => {
    const [uiState, setUiState] = useUiState();

    const initialValue = useMemo(() => {
        if (!profile) return null;

        return {
            notes: {
                collabStatus: profile?.funnel_status.toLowerCase() ?? '', // profile.funnel_status (toLowerCase)
                nextStep: profile?.next_step ?? '', // profile.next_step
                fee: profile?.rate_amount ?? '', // profile.rate_amount
                videoDetails: profile?.video_details ?? '', // profile.video_details
                affiliateLink: '', // ??
                scheduledPostDate: profile?.scheduled_post_date ?? '', // profile.scheduled_post_date
                notes: '', // notes data by current_user & profile.id (sequence)
            },
            shippingDetails: {
                name: profile?.real_full_name ?? '', // profile.real_full_name
                phoneNumber: '', // ??
                streetAddress: '', // address.address_line_1?
                city: '', // address.city
                state: '', // address.state
                country: '', // address.country
                postalCode: '', // address.postal_code
                trackingCode: '', // address.tracking_code
                fullAddress: '', // probably combination of stuff above
            },
        };
    }, [profile]);

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
                {profile && initialValue ? (
                    <ProfileScreenProvider initialValue={initialValue}>
                        <ProfileScreen profile={profile} onCancel={handleClose} onUpdate={handleUpdate} />
                    </ProfileScreenProvider>
                ) : null}
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
