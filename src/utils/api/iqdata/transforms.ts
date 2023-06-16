import { featRecommended } from 'src/constants/feature-flags';
import type { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';
import type {
    SearchInfluencersPayload,
    SearchInfluencersTextTagsFilter,
} from './influencers/search-influencers-payload';
import { Gender, LastPosted } from '../types';

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

const genderFilter = (value: string) => {
    const code = Gender.parse(value);
    return { code };
};

const textFilter = (value: string) => {
    return value;
};

const keywordsFilter = (value: string) => {
    return value;
};

const lastPostedFilter = (value: number) => {
    return LastPosted.parse(value);
};

const usernameFilter = (value: string) => {
    return { value };
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

const textTagsFilter = (s: string) => {
    const tags = s.split(' ');

    return tags.reduce<SearchInfluencersTextTagsFilter[]>((o, value) => {
        return [...o, { type: 'hashtag', value }];
    }, []);
};

const tagsFilter = (value: { tag: string }[]) => {
    const tags = value.map((tag) => `#${tag.tag}`);

    return tags.join(' ');
};

const lookalikeFilter = (value: CreatorAccount[]) => {
    const lookalikes = value.map((account) => `@${account.user_id}`);

    return lookalikes.join(' ');
};

export const prepareFetchCreatorsFiltered = ({
    platform = 'youtube',
    tags = [],
    lookalike = [],
    influencerLocation = [],
    audienceLocation = [],
    resultsPerPageLimit = 10,
    page = 0,
    ...params
}: FetchCreatorsFilteredParams): {
    platform: CreatorPlatform;
    body: SearchInfluencersPayload['body'];
} => {
    const body: SearchInfluencersPayload['body'] = {
        paging: {
            limit: resultsPerPageLimit,
            skip: page ? page * resultsPerPageLimit : 0,
        },
        audience_source: 'any',
    };

    body.filter = {};

    if (tags.length > 0) {
        if (!body.filter.relevance) {
            body.filter.relevance = { value: '' };
        }

        body.filter.relevance.value += ' ' + tagsFilter(tags);
    }

    if (lookalike.length > 0) {
        if (!body.filter.relevance) {
            body.filter.relevance = { value: '' };
        }

        body.filter.relevance.value += ' ' + lookalikeFilter(lookalike);
    }

    if (params.gender) {
        body.filter.gender = genderFilter(params.gender);
    }

    if (params.text) {
        body.filter.text = textFilter(params.text);
    }

    if (params.username) {
        body.filter.username = usernameFilter(params.username);

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

    if (params.views && platform !== 'instagram') {
        body.filter.views = leftRightNumberTransform(params.views);
    }

    if (params.views && platform === 'instagram') {
        body.filter.reels_plays = leftRightNumberTransform(params.views);
    }

    if (params.audience) {
        body.filter.followers = leftRightNumberTransform(params.audience);
    }

    if (audienceLocation && audienceLocation.length > 0) {
        body.filter.audience_geo = audienceLocation.map(locationTransform) || [];
    }

    if (influencerLocation && influencerLocation.length > 0) {
        body.filter.geo = influencerLocation.map(locationTransform) || [];
    }

    if (params.lastPost) {
        body.filter.last_posted = lastPostedFilter(+params.lastPost);
    }

    if (params.contactInfo) {
        body.filter.with_contact = [{ type: 'email', action: 'should' }];
    }

    if (params.engagement && Number(params.engagement) >= 0 && Number(params.engagement / 100)) {
        body.filter.engagement_rate = { value: Number((params.engagement / 100).toFixed(2)), operator: 'gte' };
    }

    if (params.only_recommended && params.recommendedInfluencers && featRecommended()) {
        body.filter.filter_ids = isRecommendedTransform(platform, params.recommendedInfluencers);
    }

    if (params.keywords) {
        body.filter.keywords = keywordsFilter(params.keywords);

        if (!body.filter.actions) {
            body.filter.actions = [];
        }

        body.filter.actions.push({
            filter: 'keywords',
            action: 'should',
        });
    }

    if (params.text_tags) {
        body.filter.text_tags = textTagsFilter(params.text_tags);
    }

    body.sort = { field: 'followers', direction: 'desc' };

    if (Object.keys(body.filter).length > 0) {
        body.sort.field = 'engagements';
    }

    if (body.filter.relevance) {
        body.sort.field = 'relevance';
    }

    return { platform, body };
};
