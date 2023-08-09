import { useCallback, useState } from 'react';
import { CollabAffiliateLinkInput } from './collab-affiliate-link-input';
import { CollabFeeInput } from './collab-fee-input';
import { CollabScheduledPostDateInput } from './collab-scheduled-post-date-input';
import { CollabVideoDetailsInput } from './collab-video-details-input';
import { OutreachCollabStatusInput } from './outreach-collab-status-input';
import { OutreachNotesInput } from './outreach-notes-input';

export type ProfileNotes = {
    collabStatus: string;
    notes: string;
    fee: string;
    videoDetails: string;
    affiliateLink: string;
    scheduledPostDate: string;
};

type Props = {
    onUpdate?: (data: ProfileNotes) => void;
    value?: Partial<ProfileNotes>;
};

export const ProfileNotesTab = (props: Props) => {
    const [data, setData] = useState(() => {
        return {
            collabStatus: '',
            notes: '',
            fee: '',
            videoDetails: '',
            affiliateLink: '',
            scheduledPostDate: '',
            ...props.value,
        };
    });

    const handleUpdate = useCallback(
        (k: string, v: string) => {
            setData((state) => {
                return { ...state, [k]: v };
            });
            props.onUpdate && props.onUpdate(data);
        },
        [data, props],
    );

    return (
        <>
            <OutreachCollabStatusInput
                value={data.collabStatus}
                onInput={(e) => handleUpdate('collabStatus', e.currentTarget.value)}
            />
            <OutreachNotesInput value={data.notes} onInput={(e) => handleUpdate('notes', e.currentTarget.value)} />
            <CollabFeeInput value={data.fee} onInput={(e) => handleUpdate('fee', e.currentTarget.value)} />
            <CollabVideoDetailsInput
                value={data.videoDetails}
                onInput={(e) => handleUpdate('videoDetails', e.currentTarget.value)}
            />
            <CollabAffiliateLinkInput
                value={data.affiliateLink}
                onInput={(e) => handleUpdate('affiliateLink', e.currentTarget.value)}
            />
            <CollabScheduledPostDateInput
                value={data.scheduledPostDate}
                onInput={(e) => handleUpdate('scheduledPostDate', e.currentTarget.value)}
            />
        </>
    );
};
