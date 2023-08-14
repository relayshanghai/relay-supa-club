import type { HTMLAttributes } from 'react';

type Props = {
    value?: string;
    onSave?: (value: string) => void;
    onUpdate?: (value: string) => void;
    onOpenList?: () => void;
} & HTMLAttributes<HTMLDivElement>;

export const OutreachNotesInput = ({ value = '', onSave, onUpdate, onOpenList, ...props }: Props) => {
    return (
        <div {...props}>
            <label className="flex w-full flex-col text-sm text-gray-800" htmlFor="outreach-notes-input">
                <div className="font-semibold" onClick={() => onOpenList && onOpenList()}>
                    Notes
                </div>
            </label>
            <textarea
                value={value}
                onInput={(e) => onUpdate && onUpdate(e.currentTarget.value)}
                className="textarea-field"
                cols={3}
                rows={5}
                name="outreach-notes-input"
                id="outreach-notes-input"
            />
            <div
                onClick={() => onSave && onSave(value)}
                className="inline-flex h-9 w-[250.50px] items-center justify-center gap-1 rounded-md border border-violet-500 px-4 py-2"
            >
                <button className="text-center text-sm font-medium leading-tight tracking-tight text-violet-500">
                    Add Note
                </button>
            </div>
            <p className="text-xs text-primary-400">&nbsp;</p>
        </div>
    );
};
