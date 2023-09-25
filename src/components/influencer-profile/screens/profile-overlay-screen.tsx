import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useState } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { NotesListOverlayScreen } from './notes-list-overlay';
import { ProfileScreenProvider, useUiState } from './profile-screen-context';

type Props = {
    profile: SequenceInfluencerManagerPage | null;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onUpdate?: (data: Partial<ProfileValue>) => void;
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

export const ProfileOverlayScreen = ({ profile, onOpen, ...props }: Props) => {
    const [uiState, setUiState] = useUiState();
    const { getNotes, saveSequenceInfluencer } = useSequenceInfluencerNotes();

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

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            handleClose();
            if (profile === null) return;

            saveSequenceInfluencer.call(profile.id, data).then((profile) => {
                // @note updates local state without additional query
                //       this will cause issue showing previous state though
                setLocalProfile(mapProfileToFormData(profile));
                saveSequenceInfluencer.refresh();

                props.onUpdate && props.onUpdate(data);
            });
        },
        [profile, props, handleClose, saveSequenceInfluencer, mapProfileToFormData, setLocalProfile],
    );

    const handleNoteListOpen = useCallback(() => {
        if (!profile) return;
        getNotes.call(profile.id);
    }, [getNotes, profile]);

    const handleNoteListClose = useCallback(() => {
        setUiState((s) => {
            return { ...s, isNotesListOverlayOpen: false };
        });
        getNotes.refresh();
    }, [getNotes, setUiState]);

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
                notes={getNotes.data}
                isLoading={getNotes.isLoading}
                isOpen={uiState.isNotesListOverlayOpen}
                onClose={handleNoteListClose}
                onOpen={handleNoteListOpen}
                influencerSocialProfileId={profile?.id}
            />
        </>
    );
};
