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
export const columnsInSequence: SequenceColumn[] = ['name', 'currentStep', 'status', 'sendTime', 'nextEmailPreview'];
export const columnsIgnored: SequenceColumn[] = ['name', 'lastEmailSent', 'status', 'restartSequence'];
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
    Scheduled: 'bg-yellow-100 text-yellow-500',
    Delivered: 'bg-green-100 text-green-500',
    Bounced: 'bg-red-100 text-red-500',
    Failed: 'bg-red-100 text-red-500',
    Replied: 'bg-yellow-100 text-red-500',
    'Link Clicked': 'bg-gray-100 text-red-500',
    Opened: 'bg-blue-100 text-blue-500',
    Default: 'bg-gray-100 text-gray-500',
};
