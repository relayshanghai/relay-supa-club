import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useState } from 'react';
import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen-legacy';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen-legacy';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { NotesListOverlayScreen } from './notes-list-overlay';
import { ProfileScreenProvider, useUiState } from './profile-screen-context';
import type { SearchTableInfluencer } from 'types';
import { mapProfileToNotes, mapProfileToShippingDetails } from 'src/components/inbox/helpers';

type Props = {
    profile: SequenceInfluencerManagerPage | null;
    influencerData: SearchTableInfluencer | null;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onUpdate?: (data: Partial<ProfileValue>) => void;
};

export const ProfileOverlayScreen = ({ profile, influencerData, onOpen, ...props }: Props) => {
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
            if (profile === null) return;

            saveSequenceInfluencer.call(profile.id, data).then((profile) => {
                // @note updates local state without additional query
                //       this will cause issue showing previous state though
                setLocalProfile(mapProfileToFormData(profile));
                saveSequenceInfluencer.refresh();

                props.onUpdate && props.onUpdate(data);
            });
        },
        [profile, props, saveSequenceInfluencer, mapProfileToFormData, setLocalProfile],
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
                {profile && influencerData && initialValue ? (
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
