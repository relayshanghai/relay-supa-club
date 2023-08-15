import type { InputHTMLAttributes } from 'react';

type Props = {
    value?: string;
    onSave?: (value: string) => void;
    onUpdate?: (value: string) => void;
    onOpenList?: () => void;
    disabled?: boolean;
} & InputHTMLAttributes<HTMLTextAreaElement>;

export const OutreachNotesInput = ({ value = '', onSave, onUpdate, onOpenList, ...props }: Props) => {
    return (
        <div>
            <label className="flex w-full flex-col text-sm text-gray-800" htmlFor="outreach-notes-input">
                <div className="font-semibold" onClick={() => onOpenList && onOpenList()}>
                    Notes
                </div>
            </label>
            <textarea
                {...props}
                value={value}
                onInput={(e) => onUpdate && onUpdate(e.currentTarget.value)}
                className="textarea-field"
                cols={3}
                rows={5}
                name="outreach-notes-input"
                id="outreach-notes-input"
            />

            <button
                disabled={props.disabled}
                onClick={() => onSave && onSave(value)}
                className="group text-center text-sm font-medium leading-tight tracking-tight text-violet-500"
            >
                <div className="inline-flex h-9 w-[250.50px] items-center justify-center gap-1 rounded-md border border-violet-500 px-4 py-2 group-disabled:border-slate-300 group-disabled:bg-slate-200 group-disabled:text-slate-300">
                    Add Note
                </div>
            </button>
            <p className="text-xs text-primary-400">&nbsp;</p>
        </div>
    );
};
