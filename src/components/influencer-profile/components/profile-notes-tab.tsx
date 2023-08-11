import React, { useCallback, useEffect, useState } from 'react';
import { CollabAffiliateLinkInput } from './collab-affiliate-link-input';
import { CollabFeeInput } from './collab-fee-input';
import { CollabScheduledPostDateInput } from './collab-scheduled-post-date-input';
import { CollabVideoDetailsInput } from './collab-video-details-input';
import { OutreachCollabStatusInput } from './outreach-collab-status-input';
import { OutreachNotesInput } from './outreach-notes-input';
import { OutreachNextStepsInput } from './outreach-next-steps-input';

export const COLLAB_STATUS_OPTIONS = [
    {
        id: 'negotiating',
        label: 'Negotiating',
        value: 10,
        style: 'bg-blue-100 text-blue-500',
    },
    {
        id: 'confirmed',
        label: 'Confirmed',
        value: 20,
        style: 'bg-primary-100 text-primary-500',
    },
    {
        id: 'shipped',
        label: 'Shipped',
        value: 30,
        style: 'bg-yellow-100 text-yellow-500',
    },
    {
        id: 'received',
        label: 'Received',
        value: 40,
        style: 'bg-green-100 text-green-500',
    },
    {
        id: 'contentApproval',
        label: 'Content Approval',
        value: 50,
        style: 'bg-pink-100 text-pink-500',
    },
    {
        id: 'posted',
        label: 'Posted',
        value: 60,
        style: 'bg-cyan-100 text-cyan-500',
    },
    {
        id: 'rejected',
        label: 'Rejected',
        value: 70,
        style: 'bg-red-100 text-red-500',
    },
];

export type ProfileNotes = {
    collabStatus: string;
    notes: string;
    nextStep: string;
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
    const [data, setData] = useState<ProfileNotes>(() => {
        return {
            collabStatus: '',
            notes: '',
            nextStep: '',
            fee: '',
            videoDetails: '',
            affiliateLink: '',
            scheduledPostDate: '',
            ...props.value,
        };
    });

    useEffect(() => {
        setData((s) => {
            return { ...s, ...props.value };
        });
    }, [props.value]);

    const handleUpdate = useCallback(
        (k: string, v: any) => {
            setData((state) => {
                return { ...state, [k]: v };
            });
            props.onUpdate && props.onUpdate(data);
        },
        [data, props],
    );

    return (
        <>
            <div className="grid grid-flow-row auto-rows-max gap-2">
                <div className="inline-flex items-center justify-between gap-2.5">
                    <div className="text-base font-semibold leading-normal tracking-tight text-gray-600">Outreach</div>
                </div>

                <OutreachCollabStatusInput
                    onUpdate={(data) => handleUpdate('collabStatus', data)}
                    options={COLLAB_STATUS_OPTIONS}
                    selected={['negotiating']}
                />
                <OutreachNextStepsInput
                    value={data.nextStep}
                    onInput={(e) => handleUpdate('nextStep', e.currentTarget.value)}
                />
                <OutreachNotesInput value={data.notes} onSave={(value) => handleUpdate('notes', value)} />

                <div className="h-px border border-neutral-200" />

                <div className="inline-flex items-center justify-between gap-2.5">
                    <div className="text-base font-semibold leading-normal tracking-tight text-gray-600">Collab</div>
                </div>

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
            </div>
        </>
    );
};
