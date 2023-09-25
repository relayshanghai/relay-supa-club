import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import { NotesList } from '../components/notes-list';
import { Spinner } from 'src/components/icons';
import { useCallback, useEffect } from 'react';
import type { NoteData } from '../components/note';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ViewInfluencerProfileNotes } from 'src/utils/analytics/events';

type Props = {
    // @todo create type for this
    notes: NoteData[] | null;
    isLoading?: boolean | null;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    influencerSocialProfileId?: string;
};

export const NotesListOverlayScreen = ({
    notes,
    isLoading,
    isOpen,
    onOpen,
    influencerSocialProfileId,
    ...props
}: Props) => {
    const { track } = useRudderstackTrack();
    const handleNoteListOnOpen = useCallback(() => {
        if (isOpen && onOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);

    useEffect(() => {
        if (isLoading || isLoading === null || !notes || !isOpen || !onOpen || !influencerSocialProfileId) {
            return;
        }

        track(ViewInfluencerProfileNotes, {
            influencer_id: influencerSocialProfileId,
            total_notes: notes.length,
        });
    }, [isLoading, notes, track, isOpen, onOpen, influencerSocialProfileId]);

    return (
        <>
            <OverlayRight
                isOpen={isOpen}
                onClose={() => props.onClose && props.onClose()}
                onOpen={handleNoteListOnOpen}
            >
                {isLoading === false && notes ? (
                    <NotesList notes={notes} />
                ) : (
                    <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                )}
            </OverlayRight>
        </>
    );
};
