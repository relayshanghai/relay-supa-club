import type { InputHTMLAttributes } from 'react';
import React from 'react';
import dateFormat from 'src/utils/dateFormat';

type Props = {
    label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const CollabScheduledPostDateInput = (props: Props) => {   
    return (
        <>
            <label className="flex w-full flex-col text-sm text-gray-500">
                <div className="font-semibold">{props.label}</div>
                <div>
                    <input
                        value={dateFormat(String(props.value ?? ''), 'isoDate', true, true)}
                        type="date"
                        name="collab-scheduled-post-date"
                        className="my-2 block w-full appearance-no  ne rounded-md border border-transparent bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-xs"
                        {...props}
                    />
                </div>
                <span>
                    <p className="text-xs">&nbsp;</p>
                </span>
            </label>
        </>
    );
};
