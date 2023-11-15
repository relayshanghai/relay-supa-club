import type { ForwardedRef, InputHTMLAttributes } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { Confirm, Cross, Edit } from '../icons';
import { clientLogger } from 'src/utils/logger-client';

export interface TableInlineInputProps {
    value: string | null;
    textPromptForMissingValue: string;
    onSubmit: (value: string) => Promise<void>;
    type?: InputHTMLAttributes<HTMLInputElement>['type'];
}

const TableInlineInputWithRef = (
    { value, type = 'text', onSubmit, textPromptForMissingValue }: TableInlineInputProps,
    ref: ForwardedRef<any>,
) => {
    const [inputValue, setInputValue] = useState('');
    const [editing, setEditing] = useState(false);
    useEffect(() => {
        if (value) setInputValue(value);
    }, [value]);
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (value: string) => {
        setSubmitting(true);
        try {
            await onSubmit(value);
        } catch (error) {
            clientLogger(error, 'error');
        }
        setSubmitting(false);
    };
    return (
        <button
            className={`relative flex w-full cursor-pointer items-center justify-between rounded ${
                editing ? 'border-none ' : 'border border-gray-300 px-4 py-2'
            }   text-xs text-gray-900 hover:text-primary-500`}
            onClick={() => setEditing(true)}
        >
            {editing || submitting ? (
                <div
                    ref={ref}
                    onClick={(e) => e.stopPropagation()}
                    className="group z-[10] flex h-full w-full flex-row items-center"
                >
                    <form
                        className="flex h-full w-full items-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setEditing(false);
                            handleSubmit(inputValue);
                        }}
                    >
                        <input
                            disabled={submitting}
                            data-testid={`table-inline-input-${textPromptForMissingValue.toLowerCase()}`}
                            type={type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="rounded border border-gray-300 py-[7px] pl-4 text-xs text-gray-600 outline-none"
                        />
                        <div className="flex justify-end">
                            <button
                                disabled={submitting}
                                type="submit"
                                className="column-center h-8 w-8 cursor-pointer rounded-md bg-primary-500 duration-300 hover:bg-primary-700"
                            >
                                <Confirm className="h-4 w-4 rounded-md fill-current text-white" />
                            </button>
                            <button
                                type="button"
                                data-testid="table-inline-input-cancel"
                                disabled={submitting}
                                onClick={() => setEditing(false)}
                                className="column-center h-8 w-8 cursor-pointer rounded-md border border-gray-200 bg-gray-100 duration-300 hover:bg-gray-200"
                            >
                                <Cross className="h-4 w-4 fill-current text-gray-600" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    {value || (
                        <div className="cursor-pointer text-red-400 hover:text-red-600">
                            {textPromptForMissingValue}
                        </div>
                    )}
                </div>
            )}
            {!editing && <Edit className="ml-2 h-4 w-4 text-gray-300" />}
        </button>
    );
};

export const TableInlineInput = forwardRef(TableInlineInputWithRef);
