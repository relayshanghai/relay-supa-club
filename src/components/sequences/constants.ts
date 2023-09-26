import type sequences from 'i18n/en/sequences';
import type { SequenceInfluencer } from 'src/utils/api/db';

export type SequenceColumn = keyof (typeof sequences)['columns'];
export const columnsNeedsAttention: SequenceColumn[] = [
    'name',
    'email',
    'influencerTopics',
    'dateAdded',
    'sequenceActions',
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
export const sequencesIndexColumns: SequenceIndexColumn[] = [
    'sequence',
    'influencers',
    'openRate',
    'manager',
    'product',
    'sequenceActions',
];

export const EMAIL_STATUS_STYLES = {
    Scheduled: { style: 'bg-yellow-100 text-yellow-500' },
    Delivered: { style: 'bg-green-100 text-green-500' },
    Bounced: { style: 'bg-red-100 text-red-500' },
    Failed: { style: 'bg-red-100 text-red-500' },
    Replied: { style: 'bg-yellow-100 text-red-500' },
    'Link Clicked': { style: 'bg-gray-100 text-blue-500' },
    Opened: { style: 'bg-blue-100 text-blue-500' },
    Default: { style: 'bg-gray-100 text-gray-500' },
};

export const EMAIL_STEPS = {
    Outreach: {},
    '1st Follow-up': {},
    '2nd Follow-up': {},
    '3rd Follow-up': {},
    '4th Follow-up': {},
};
