import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useState } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen-legacy';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen-legacy';
import { NotesListOverlayScreen } from './notes-list-overlay';
import { ProfileScreenProvider, useUiState } from './profile-screen-context';
import type { SearchTableInfluencer } from 'types';

type Props = {
    profile: SequenceInfluencerManagerPage | null;
    influencerData: SearchTableInfluencer | null;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onUpdate?: (data: Partial<ProfileValue>) => void;
};

const dummyNote = {
    author: {
        id: '1',
        name: 'Jim',
        avatar: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=relay-manager-no-name@example.com&size=96',
    },
    content: 'This is a sample note content.',
    id: 'note1',
    created_at: '2023-09-13T12:00:00Z',
    updated_at: '2023-09-13T12:30:00Z',
};

export const mapProfileToNotes = (profile: SequenceInfluencerManagerPage) => {
    return {
        collabStatus: profile?.funnel_status ?? '', // profile.funnel_status (toLowerCase)
        nextStep: profile?.next_step ?? '', // profile.next_step
        fee: profile?.rate_amount ?? '', // profile.rate_amount
        videoDetails: profile?.video_details ?? '', // profile.video_details
        affiliateLink: '', // ??
        scheduledPostDate: profile?.scheduled_post_date ?? '', // profile.scheduled_post_date
        notes: '', // will be filled by getNotes
    };
};

export const mapProfileToShippingDetails = (profile: SequenceInfluencerManagerPage) => {
    return {
        name: profile?.address?.name ?? '', // profile.real_full_name
        phoneNumber: profile?.address?.phone_number ?? '', // ??
        streetAddress: profile?.address?.address_line_1 ?? '', // address.address_line_1?
        city: profile?.address?.city ?? '', // address.city
        state: profile?.address?.state ?? '', // address.state
        country: profile?.address?.country ?? '', // address.country
        postalCode: profile?.address?.postal_code ?? '', // address.postal_code
        trackingCode: profile?.address?.tracking_code ?? '', // address.tracking_code
        fullAddress: '', // probably combination of stuff above
    };
};

export const ProfileOverlayScreen = ({ profile, influencerData, onOpen, ...props }: Props) => {
    const [uiState, setUiState] = useUiState();

    const mapProfileToFormData = useCallback((p: typeof profile) => {
        if (!p) return null;
        return {
            notes: mapProfileToNotes(p),
            shippingDetails: mapProfileToShippingDetails(p),
        };
    }, []);

    const [initialValue, setLocalProfile] = useState<ProfileValue | null>(() => mapProfileToFormData(profile));

    useEffect(() => {
        setLocalProfile(mapProfileToFormData(profile));
    }, [profile, mapProfileToFormData]);

    const handleClose = useCallback(() => {
        props.onClose && props.onClose();
    }, [props]);

    const handleUpdate = () => {
        handleClose();
        return;
    };

    const handleNoteListOpen = () => {
        if (!profile) return;
    };

    const handleNoteListClose = () => {
        setUiState((s) => {
            return { ...s, isNotesListOverlayOpen: false };
        });
    };

    return (
        <>
            <OverlayRight isOpen={props.isOpen} onClose={handleClose} onOpen={() => onOpen && onOpen()}>
                {profile && influencerData && initialValue ? (
                    <ProfileScreenProvider initialValue={initialValue}>
                        <ProfileScreen profile={profile} onCancel={handleClose} onUpdate={handleUpdate} />
                    </ProfileScreenProvider>
                ) : null}
            </OverlayRight>

            <NotesListOverlayScreen
                notes={[dummyNote]}
                isLoading={false}
                isOpen={uiState.isNotesListOverlayOpen}
                onClose={handleNoteListClose}
                onOpen={handleNoteListOpen}
            />
        </>
    );
};
