import type { InputHTMLAttributes } from 'react';
import { ArrowRightOnRectangle, Spinner } from 'src/components/icons';

type Props = {
    label: string;
    buttonText: string;
    value?: string;
    onSave?: (value: string) => void;
    onUpdate?: (value: string) => void;
    onOpenList?: () => void;
    disabled?: boolean;
} & InputHTMLAttributes<HTMLTextAreaElement>;

export const OutreachNotesInput = ({
    buttonText,
    label,
    value = '',
    onSave,
    onUpdate,
    onOpenList,
    ...props
}: Props) => {
    return (
        <div>
            <label className="flex w-full cursor-pointer flex-col text-sm text-gray-500" htmlFor="outreach-notes-input">
                <div className="flex gap-1 font-semibold" onClick={() => onOpenList && onOpenList()}>
                    <span>{label}</span>
                    <ArrowRightOnRectangle className="h-3 w-3 stroke-primary-500 align-top" />
                </div>
            </label>
            <div className="my-2 flex flex-col items-start gap-4">
                <textarea
                    {...props}
                    value={value}
                    onInput={(e) => onUpdate && onUpdate(e.currentTarget.value)}
                    className="textarea-field"
                    cols={3}
                    rows={5}
                    name="outreach-notes-input"
                    id="outreach-notes-input"
                    disabled={props.disabled}
                />

                <button
                    disabled={props.disabled}
                    onClick={() => onSave && onSave(value)}
                    className="group text-center text-sm font-medium leading-tight tracking-tight text-violet-500"
                >
                    <div className="inline-flex items-center justify-center gap-1 rounded-md border border-violet-500 px-4 py-2 group-disabled:border-slate-300 group-disabled:bg-slate-200 group-disabled:text-slate-300">
                        {!props.disabled ? buttonText : <Spinner className="h-5 w-5 fill-primary-600 text-white" />}
                    </div>
                </button>
            </div>
            <p className="text-xs text-primary-400">&nbsp;</p>
        </div>
    );
};
