import type { HTMLAttributes } from 'react';
import { useEffect } from 'react';
import React, { useState, useCallback } from 'react';
import { useAsync } from 'src/hooks/use-async';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { CampaignNotes } from '../../../utils/api/db/types';
import type { Profile } from './profile-header';

type Props = {
    // @todo author and profile optional for now
    author?: { id: string };
    profile?: Profile;
    value?: string;
    onSave?: (value: string) => void;
} & HTMLAttributes<HTMLDivElement>;

export const OutreachNotesInput = ({ profile, author, value = '', onSave, ...props }: Props) => {
    const [fieldValue, setFieldValue] = useState(value);

    const saveNote = useAsync(async (body: CampaignNotes['Insert']) => {
        await apiFetch('/api/notes/create', { body });
    });

    useEffect(() => {
        setFieldValue(value);
    }, [value]);

    const handleSave = useCallback(() => {
        saveNote
            .call({
                comment: fieldValue,
                //  @todo still no concrete profile / author shape
                influencer_social_profile_id: profile?.influencer_id ?? '52f66871-af55-4372-be8f-997ebff3d721',
                sequence_influencer_id: profile?.id ?? '0da5c793-04ac-4eb4-8c2d-d0ee1b55e009',
                user_id: author?.id ?? '2cf901f7-15ec-4734-b50c-8dd3430a1e55',
            })
            .then(() => {
                onSave && onSave(fieldValue);
            });
    }, [fieldValue, author, onSave, profile, saveNote]);

    return (
        <div {...props}>
            <label className="flex w-full flex-col text-sm text-gray-800" htmlFor="outreach-notes-input">
                <div className="font-semibold">Notes</div>
            </label>
            <textarea
                value={fieldValue}
                onChange={(e) => setFieldValue(e.currentTarget.value)}
                className="textarea-field"
                cols={3}
                rows={5}
                name="outreach-notes-input"
                id="outreach-notes-input"
            />
            <div
                onClick={handleSave}
                className="inline-flex h-9 w-[250.50px] items-center justify-center gap-1 rounded-md border border-violet-500 px-4 py-2"
            >
                <button className="text-center text-sm font-medium leading-tight tracking-tight text-violet-500">
                    Add a new post
                </button>
            </div>
            <p className="text-xs text-primary-400">&nbsp;</p>
        </div>
    );
};
