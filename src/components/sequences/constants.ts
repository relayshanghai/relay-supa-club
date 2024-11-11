import type sequences from 'i18n/en/sequences';

import type { EmailDeliveryStatus, EmailTrackingStatus, SequenceInfluencer } from 'src/utils/api/db';

export type SequenceColumn = keyof (typeof sequences)['columns'];
export const columnsNeedsAttention: SequenceColumn[] = [
    'name',
    'email',
    'influencerTopics',
    'dateAdded',
    'campaignActions',
];
export const columnsInSequence: SequenceColumn[] = ['name', 'lastEmailSent', 'status', 'sendTime', 'nextEmailPreview'];
export const columnsIgnored: SequenceColumn[] = ['name', 'currentStep', 'status', 'restartSequence'];
export const sequenceColumns = (currentTab: SequenceInfluencer['funnel_status']) =>
    currentTab === 'To Contact'
        ? columnsNeedsAttention
        : currentTab === 'In Sequence'
        ? columnsInSequence
        : currentTab === 'Ignored'
        ? columnsIgnored
        : [];

export type SequenceIndexColumn = keyof (typeof sequences)['indexColumns'];
export const sequencesIndexColumns: SequenceIndexColumn[] = ['campaign', 'influencers', 'manager', 'campaignActions'];

export type EmailStatus = EmailTrackingStatus | EmailDeliveryStatus | 'Ignored';

export const EMAIL_STATUS_STYLES: {
    [key in EmailStatus]: { style: string };
} = {
    Unscheduled: { style: 'bg-yellow-100 text-yellow-500' },
    Scheduled: { style: 'bg-primary-100 text-primary-500' },
    Delivered: { style: 'bg-blue-100 text-blue-500' },
    Opened: { style: 'bg-pink-100 text-pink-500' },
    'Link Clicked': { style: 'bg-cyan-100 text-cyan-500' },
    Bounced: { style: 'bg-red-100 text-red-500' },
    Failed: { style: 'bg-orange-100 text-orange-500' },
    Replied: { style: 'bg-green-100 text-green-500' },
    Ignored: { style: 'bg-gray-100 text-gray-500' },
};

export const EMAIL_STEPS = {
    Outreach: {},
    '1st Follow-up': {},
    '2nd Follow-up': {},
};
