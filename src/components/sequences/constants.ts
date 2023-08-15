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
