import { featRecommended } from 'src/constants/feature-flags';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';
import type { GenderAllCode } from 'types/iqdata/influencer-search-request-body';
import type {
    SearchInfluencersPayload,
    SearchInfluencersTextTagsFilter,
} from './influencers/search-influencers-payload';

type NullStringTuple = [null | string, null | string];

export interface FetchCreatorsFilteredParams {
    platform?: CreatorPlatform;
    tags?: { tag: string }[];
    lookalike?: CreatorAccount[];
    text?: string;
    username?: string;
    keywords?: string;
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
    recommendedInfluencers?: string[];
    text_tags?: string;
}

const locationTransform = ({ id, weight }: { id: string; weight: number | string }) => ({
    id: Number(id),
    weight: weight ? Number(weight) / 100 : 0.5,
});

const genderTransform = (gender: string) => {
    const upper = gender.toUpperCase();
    const allowed: GenderAllCode[] = ['FEMALE', 'MALE', 'KNOWN', 'UNKNOWN'];
    if (allowed.includes(upper as GenderAllCode)) return { code: upper as GenderAllCode };
    clientLogger('bad option for gender: ' + gender, 'error', true); // unexpected
    return undefined;
};

const leftRightNumberTransform = (tuple: NullStringTuple) => {
    const [left, right] = tuple;
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

const textTagsTransformer = (s: string) => {
    const tags = s.split(' ');

    return tags.reduce<SearchInfluencersTextTagsFilter[]>((o, value) => {
        return [...o, { type: 'hashtag', value }];
    }, []);
};

export const prepareFetchCreatorsFiltered = ({
    platform = 'youtube',
    tags = [],
    lookalike = [],
    influencerLocation = [],
    audienceLocation = [],
    resultsPerPageLimit = 10,
    page = 0,
    text,
    username,
    audience,
    views,
    gender,
    engagement,
    lastPost,
    contactInfo,
    only_recommended,
    recommendedInfluencers,
    ...params
}: FetchCreatorsFilteredParams): {
    platform: CreatorPlatform;
    body: SearchInfluencersPayload['body'];
} => {
    const tagsValue = tags.map((tag: { tag: string }) => `#${tag.tag}`);
    const lookalikeValue = lookalike.map((account: CreatorAccount) => `@${account.user_id}`);

    const body: SearchInfluencersPayload['body'] = {
        paging: {
            limit: resultsPerPageLimit,
            skip: page ? page * resultsPerPageLimit : 0,
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

    if (body.sort && tagsValue.length > 0) {
        body.sort.field = 'relevance';
    }

    if (body.filter && gender) {
        body.filter.gender = genderTransform(gender);
    }

    if (body.filter && text) {
        body.filter.text = text;
    }

    if (body.filter && username) {
        body.filter.username = { value: username };

        if (!body.filter.actions) body.filter.actions = [];

        // Since username will always be provided, we can add filter actions for text and username here
        body.filter.actions.push({
            filter: 'username',
            action: 'should',
        });
        body.filter.actions.push({
            filter: 'text',
            action: 'should',
        });
    }

    if (body.filter && views && platform !== 'instagram') {
        body.filter.views = leftRightNumberTransform(views);
    }

    if (body.filter && views && platform === 'instagram') {
        body.filter.reels_plays = leftRightNumberTransform(views);
    }

    if (body.filter && audience) {
        body.filter.followers = leftRightNumberTransform(audience);
    }

    if (body.filter && audienceLocation && audienceLocation.length > 0) {
        body.filter.audience_geo = audienceLocation.map(locationTransform) || [];
    }

    if (body.filter && influencerLocation && influencerLocation.length > 0) {
        body.filter.geo = influencerLocation.map(locationTransform) || [];
    }

    if (body.filter && lastPost && Number(lastPost) >= 30) {
        body.filter.last_posted = Number(lastPost);
    }

    if (body.filter && contactInfo) {
        body.filter.with_contact = [{ type: 'email', action: 'should' }];
    }

    if (body.filter && engagement && Number(engagement) >= 0 && Number(engagement / 100)) {
        body.filter.engagement_rate = { value: Number((engagement / 100).toFixed(2)), operator: 'gte' };
    }

    if (body.filter && only_recommended && recommendedInfluencers && featRecommended()) {
        body.filter.filter_ids = isRecommendedTransform(platform, recommendedInfluencers);
    }

    if (body.filter && params.keywords) {
        body.filter.keywords = params.keywords;

        if (!body.filter.actions) {
            body.filter.actions = [];
        }

        body.filter.actions.push({
            filter: 'keywords',
            action: 'should',
        });
    }

    if (body.filter && params.text_tags) {
        body.filter.text_tags = textTagsTransformer(params.text_tags);
    }

    return { platform, body };
};
