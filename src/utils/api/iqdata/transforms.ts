import { FEAT_RECOMMENDED } from 'src/constants/feature-flags';
import { recommendedInfluencers } from 'src/constants/recommendedInfluencers';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';
import type { GenderAllCode, InfluencerSearchRequestBody } from 'types/iqdata/influencer-search-request-body';
type NullStringTuple = [null | string, null | string];

export interface FetchCreatorsFilteredParams {
    platform?: CreatorPlatform;
    tags?: { tag: string }[];
    lookalike?: CreatorAccount[];
    username: string;
    influencerLocation?: LocationWeighted[];
    audienceLocation?: LocationWeighted[];
    resultsPerPageLimit?: number;
    page?: number;
    audience: NullStringTuple;
    views: NullStringTuple;
    gender?: string;
    engagement?: number;
    lastPost?: string;
    contactInfo?: string;
    only_recommended?: boolean;
}

const locationTransform = ({ id, weight }: { id: string; weight: number | string }) => ({
    id: Number(id),
    weight: weight ? Number(weight) / 100 : 0.5,
});

const genderTransform = (gender: string) => {
    const upper = gender.toUpperCase();
    const allowed: GenderAllCode[] = ['FEMALE', 'MALE', 'KNOWN', 'UNKNOWN'];
    if (allowed.includes(upper as GenderAllCode)) return { code: upper as GenderAllCode };
    clientLogger('bad option for gender: ' + gender, 'error');
    return undefined;
};
const viewsTransform = (views: NullStringTuple) => {
    const [left, right] = views;
    return {
        left_number: left ? Number(left) ?? undefined : undefined,
        right_number: right ? Number(right) ?? undefined : undefined,
    };
};

export const isRecommendedTransform = (platform: CreatorPlatform, influencerIdsWithPlatform: string[]) => {
    // idWithPlatform is a string of the form "platform/id"
    const recommendedByPlatform = influencerIdsWithPlatform
        .filter((idWithPlatform) => idWithPlatform.split('/')[0] === platform)
        .map((idWithPlatform) => idWithPlatform.split('/')[1]);
    if (recommendedByPlatform.length > 1000) {
        // TODO: For now we can only handle 1000 influencers per platform, so if we exceed that we will need to reimplement some things: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/352
        throw new Error(
            `Too many recommended influencers for platform ${platform}. Please remove some from the recommendedInfluencers list.`,
        );
    }
    return recommendedByPlatform;
};

export const prepareFetchCreatorsFiltered = ({
    platform = 'youtube',
    tags = [],
    lookalike = [],
    influencerLocation = [],
    audienceLocation = [],
    resultsPerPageLimit = 10,
    page = 0,
    username,
    audience,
    views,
    gender,
    engagement,
    lastPost,
    contactInfo,
    only_recommended,
}: FetchCreatorsFilteredParams): {
    platform: CreatorPlatform;
    body: InfluencerSearchRequestBody;
} => {
    const tagsValue = tags.map((tag: { tag: string }) => `#${tag.tag}`);
    const lookalikeValue = lookalike.map((account: CreatorAccount) => `@${account.user_id}`);

    const body: InfluencerSearchRequestBody = {
        paging: {
            limit: resultsPerPageLimit,
            skip: page ? page * resultsPerPageLimit : undefined,
        },
        filter: {
            relevance: {
                value: [...tagsValue, ...lookalikeValue].join(' '),
            },
            actions: [{ filter: 'relevance', action: 'must' }],
        },
        sort: { field: 'followers', direction: 'desc' },
        audience_source: 'any',
    };

    if (gender) {
        body.filter.gender = genderTransform(gender);
    }
    if (username) {
        body.filter.username = { value: username };
    }
    if (views) {
        body.filter.views = viewsTransform(views);
    }
    if (audience) {
        body.filter.followers = viewsTransform(audience);
    }
    if (audienceLocation) {
        body.filter.audience_geo = audienceLocation.map(locationTransform) || [];
    }
    if (influencerLocation) {
        body.filter.geo = influencerLocation.map(locationTransform) || [];
    }
    if (lastPost && Number(lastPost) >= 30) {
        body.filter.last_posted = Number(lastPost);
    }
    if (contactInfo) {
        body.filter.with_contact = [{ type: 'email', action: 'should' }];
    }
    if (engagement && Number(engagement) >= 0 && Number(engagement / 100)) {
        body.filter.engagement_rate = { value: Number((engagement / 100).toFixed(2)), operator: 'gte' };
    }
    if (only_recommended && FEAT_RECOMMENDED) {
        body.filter.filter_ids = isRecommendedTransform(platform, recommendedInfluencers);
    }

    return { platform, body };
};
