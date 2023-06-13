import { describe, expect, it } from 'vitest';

import type { FetchCreatorsFilteredParams } from './transforms';
import { isRecommendedTransform, prepareFetchCreatorsFiltered } from './transforms';

const defaultOptions: FetchCreatorsFilteredParams = {
    platform: 'youtube',
    username: 'test_user',
    audience: [null, null],
    views: [null, null],
    recommendedInfluencers: ['youtube/1234'],
};

describe('prepareFetchCreatorsFiltered', () => {
    it('generates the correct search request body', () => {
        const { body } = prepareFetchCreatorsFiltered(defaultOptions);
        expect(body).toEqual({
            paging: { limit: 10, skip: 0 },
            filter: {
                relevance: { value: '' },
                actions: [
                    {
                        action: 'must',
                        filter: 'relevance',
                    },
                    {
                        filter: 'username',
                        action: 'should',
                    },
                    {
                        filter: 'text',
                        action: 'should',
                    },
                ],
                username: { value: 'test_user' },
                views: { left_number: undefined, right_number: undefined },
                followers: { left_number: undefined, right_number: undefined },
            },
            sort: { field: 'followers', direction: 'desc' },
            audience_source: 'any',
        });
    });

    it('adds the audience filter', () => {
        const options: FetchCreatorsFilteredParams = {
            ...defaultOptions,
            audience: ['1000', '10000'],
        };
        const { body } = prepareFetchCreatorsFiltered(options);
        expect(body.filter.followers).toEqual({ left_number: 1000, right_number: 10000 });
    });

    it('adds the views filter', () => {
        const options: FetchCreatorsFilteredParams = {
            ...defaultOptions,
            views: ['50000', null],
        };
        const { body } = prepareFetchCreatorsFiltered(options);
        expect(body.filter.views).toEqual({ left_number: 50000, right_number: undefined });
    });
    it('uses reels_plays for instagram', () => {
        const options: FetchCreatorsFilteredParams = {
            ...defaultOptions,
            views: ['50001', null],
            platform: 'instagram',
        };
        const { body } = prepareFetchCreatorsFiltered(options);
        expect(body.filter.reels_plays).toEqual({ left_number: 50001, right_number: undefined });
    });

    it('adds the audience and influencer location filter', () => {
        const options: FetchCreatorsFilteredParams = {
            ...defaultOptions,
            influencerLocation: [{ id: '123', weight: 50 }],
            audienceLocation: [
                { id: '345', weight: 75 },
                { id: '678', weight: 25 },
            ],
        };
        const { body } = prepareFetchCreatorsFiltered(options);
        expect(body.filter.geo).toEqual([{ id: 123, weight: 0.5 }]);
        expect(body.filter.audience_geo).toEqual([
            { id: 345, weight: 0.75 },
            { id: 678, weight: 0.25 },
        ]);
    });
    it('transforms recommendedInfluencers using isRecommendedTransform', () => {
        const recommendedInfluencers = [
            'youtube/UCh_ugKacslKhsGGdXP0cRRA',
            'youtube/UCwyXamwtzfDIvRjEFcqNmSw',
            'instagram/25025320',
            'instagram/208560325',
            'youtube/UCbCmjCuTUZos6Inko4u57UQ',
        ];
        const result = isRecommendedTransform('youtube', recommendedInfluencers);
        expect(result).toEqual(['UCh_ugKacslKhsGGdXP0cRRA', 'UCwyXamwtzfDIvRjEFcqNmSw', 'UCbCmjCuTUZos6Inko4u57UQ']);
        const result2 = isRecommendedTransform('instagram', recommendedInfluencers);
        expect(result2).toEqual(['25025320', '208560325']);

        // it throws if more than 1000 influencers are passed in
        const recommendedInfluencers2 = Array.from({ length: 1001 }, (_, i) => 'youtube/' + i.toString());
        expect(() => isRecommendedTransform('youtube', recommendedInfluencers2)).toThrow();
    });
    it('includes recommendedInfluencers transform', () => {
        const recommendedInfluencers = [
            'youtube/UCh_ugKacslKhsGGdXP0cRRA',
            'youtube/UCwyXamwtzfDIvRjEFcqNmSw',
            'instagram/25025320',
            'instagram/208560325',
            'youtube/UCbCmjCuTUZos6Inko4u57UQ',
        ];
        const options: FetchCreatorsFilteredParams = {
            ...defaultOptions,
            only_recommended: true,
            recommendedInfluencers,
        };
        const { body } = prepareFetchCreatorsFiltered(options);
        expect(body.filter.filter_ids?.length).toBeGreaterThan(0);
        const options2: FetchCreatorsFilteredParams = {
            ...defaultOptions,
            recommendedInfluencers,
            only_recommended: false,
        };
        const { body: body2 } = prepareFetchCreatorsFiltered(options2);
        expect(body2.filter.filter_ids).toBeUndefined();
    });
});
