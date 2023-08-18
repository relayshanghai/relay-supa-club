import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import { NotesList } from '../components/notes-list';
import { Spinner } from 'src/components/icons';
import { useCallback } from 'react';
import type { NoteData } from '../components/note';

type Props = {
    // @todo create type for this
    notes: NoteData[] | null;
    isLoading?: boolean | null;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
};

export const NotesListOverlayScreen = ({ notes, isLoading, isOpen, onOpen, ...props }: Props) => {
    const handleNoteListOnOpen = useCallback(() => {
        if (isOpen && onOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);

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
