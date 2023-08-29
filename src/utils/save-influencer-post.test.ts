import { vi, describe, it, expect } from 'vitest';
import * as influencerPostModule from './api/db/calls/influencer-post';
import type { SaveInfluencerPostData } from './save-influencer-post';
import { saveInfluencerPost } from './save-influencer-post';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { InfluencerPosts } from './api/db/types';

describe('Save influencer post', () => {
    it('Save influencer post calls insertInfluencerPost', async () => {
        const data = {
            type: '',
            campaign_id: '3',
            influencer_social_profile_id: '2',
            url: 'https://youtube.com/watch?v=123abc',
        } as SaveInfluencerPostData;

        const post = {
            id: '1',
            influencer_social_profile_id: '2',
            campaign_id: '3',
            platform: 'youtube',
            url: 'https://youtube.com/watch?v=123abc',
        } as InfluencerPosts['Row'];

        const spy = vi.spyOn(influencerPostModule, 'insertInfluencerPost').mockReturnValue(async () => post);
        const db = vi.fn() as unknown as SupabaseClient;

        const result = await saveInfluencerPost(db)(data);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.id).toBe('1');
    });
});
