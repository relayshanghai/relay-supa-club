import type { HTMLAttributes } from 'react';
import { useMemo } from 'react';
import type { NoteData } from './note';
import { Note } from './note';
import i18n from 'i18n';

type Props = {
    notes: NoteData[];
} & HTMLAttributes<HTMLDivElement>;

export const NotesList = ({ notes, ...props }: Props) => {
    const createDates = useMemo<string[]>(() => {
        const set = new Set<string>();

        notes.forEach((note) => {
            set.add(note.created_at);
        });

        const dates = Array.from(set);
        dates.sort().reverse();

        return dates;
    }, [notes]);

    const noteBlocks = useMemo(() => {
        return createDates.map((createDate) => {
            const noteItems = notes
                .filter((note) => note.created_at === createDate)
                .map((note) => <Note key={note.id} data={note} />);

            return (
                <div key={createDate} className="flex flex-col gap-4">
                    <div className="text-base font-semibold leading-normal tracking-tight text-gray-700">
                        {new Date(createDate).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </div>
                    <div className="flex flex-col gap-4">{noteItems}</div>
                </div>
            );
        });
    }, [createDates, notes]);

    const emptyNoteBlocks = <div>No Notes</div>;

    return (
        <>
            {noteBlocks.length > 0 ? (
                <div className="flex flex-grow flex-col gap-9" {...props}>
                    {noteBlocks}
                </div>
            ) : (
                <div className="flex justify-center">{emptyNoteBlocks}</div>
            )}
        </>
    );
};
