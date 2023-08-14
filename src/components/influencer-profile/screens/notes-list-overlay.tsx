import { OverlayRight } from 'src/components/influencer-profile/components/overlay-right';
import { NotesList } from '../components/notes-list';

type Props = {
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
};

export const NotesListOverlayScreen = ({ onOpen, ...props }: Props) => {
    return (
        <>
            <OverlayRight
                isOpen={props.isOpen}
                onClose={() => props.onClose && props.onClose()}
                onOpen={() => onOpen && onOpen()}
            >
                <NotesList />
            </OverlayRight>
        </>
    );
};
