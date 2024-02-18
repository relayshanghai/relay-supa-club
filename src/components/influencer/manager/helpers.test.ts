import { describe, it, expect } from 'vitest';
import type {
    SequenceInfluencerManagerPage,
    SequenceInfluencerManagerPageWithChannelData,
} from '../../../../pages/api/sequence/influencers';
import type { Sequence } from '../../../../src/utils/api/db/types';
import { filterByMe } from './helpers';
import { mockProfile } from 'src/mocks/test-user';
describe('filterByMe', () => {
    const mySequenceId = 'my-sequence_id';
    const notMySequenceId = 'not-my-sequence_id';
    /** 3 are mine, 2 are not */
    const mockInfluencers: Pick<SequenceInfluencerManagerPage, 'id' | 'sequence_id'>[] = [
        {
            id: 'test-influencer-id-1',
            sequence_id: mySequenceId,
        },
        {
            id: 'test-influencer-id-2',
            sequence_id: mySequenceId,
        },
        {
            id: 'test-influencer-id-3',
            sequence_id: mySequenceId,
        },
        {
            id: 'test-influencer-id-4',
            sequence_id: notMySequenceId,
        },
        {
            id: 'test-influencer-id-5',
            sequence_id: notMySequenceId,
        },
    ];

    const mockSequences: Pick<Sequence, 'id' | 'manager_id'>[] = [
        {
            manager_id: mockProfile.id,
            id: mySequenceId,
        },
        {
            manager_id: 'not-my-profile-id',
            id: notMySequenceId,
        },
    ];
    it('filters the list of influencers by which ones are managed by the current user', () => {
        const filteredInfluencers = filterByMe(
            mockInfluencers as SequenceInfluencerManagerPageWithChannelData[],
            mockProfile,
            mockSequences as Sequence[],
        );
        expect(filteredInfluencers.length).toBe(3);

        const filteredInfluencerIds = filteredInfluencers.map((influencer) => influencer.id);
        expect(filteredInfluencerIds).toContain('test-influencer-id-1');
        expect(filteredInfluencerIds).toContain('test-influencer-id-2');
        expect(filteredInfluencerIds).toContain('test-influencer-id-3');

        expect(filteredInfluencerIds).not.toContain('test-influencer-id-4');
        expect(filteredInfluencerIds).not.toContain('test-influencer-id-5');
    });
});
