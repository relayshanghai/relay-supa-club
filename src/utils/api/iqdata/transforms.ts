import { featRecommended } from 'src/constants/feature-flags';
import type { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';
import type {
    SearchInfluencersPayload,
    SearchInfluencersTextTagsFilter,
    with_contact,
    engagement_rate,
} from './influencers/search-influencers-payload';
import {
    last_posted,
    gender_code,
    audience_age_range,
    audience_gender,
} from './influencers/search-influencers-payload';
import type { z } from 'zod';

type NullStringTuple = [null | string, null | string];

export interface FetchCreatorsFilteredParams {
    platform?: CreatorPlatform;
    tags?: { tag: string }[];
    lookalike?: CreatorAccount[];
    text?: string;
    username?: string;
    keywords?: string;
    influencerAge?: NullStringTuple;
    influencerLocation?: LocationWeighted[];
    audienceAge?: z.input<typeof audience_age_range>;
    audienceLocation?: LocationWeighted[];
    resultsPerPageLimit?: number;
    page?: number;
    audience: NullStringTuple;
    views: NullStringTuple;
    gender?: string;
    audienceGender?: z.input<typeof audience_gender>;
    engagement?: number;
    lastPost?: z.input<typeof last_posted>;
    contactInfo?: string;
    only_recommended?: boolean;
    recommendedInfluencers?: string[];
    text_tags?: string;
}

const locationTransform = ({ id, weight }: { id: string; weight: number | string }) => ({
    id: Number(id),
    weight: weight ? Number(weight) / 100 : 0.5,
});

const genderFilter = (value: z.input<typeof gender_code>) => {
    const code = gender_code.parse(value);
    return { code };
};

const audienceGenderFilter = (value: z.input<typeof audience_gender>) => {
    return audience_gender.parse(value);
};

const textFilter = (value: string) => {
    return value;
};

const keywordsFilter = (value: string) => {
    return value;
};

const lastPostedFilter = (value: z.input<typeof last_posted>) => {
    return last_posted.parse(value);
};

const usernameFilter = (value: string) => {
    return { value };
};

const leftRightNumberTransform = (tuple: NullStringTuple) => {
    const [left_number, right_number] = tuple;
    const filter: { left_number?: number; right_number?: number } = {};

    if (left_number) {
        filter.left_number = +left_number;
    }

    if (right_number) {
        filter.right_number = +right_number;
    }

    return filter;
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

const viewsFilter = (value: NullStringTuple) => {
    return leftRightNumberTransform(value);
};

const audienceFilter = (value: NullStringTuple) => {
    return leftRightNumberTransform(value);
};

const audienceLocationFilter = (value: LocationWeighted[]) => {
    if (value.length <= 0) {
        return undefined;
    }

    return value.map(locationTransform) || [];
};

const influencerLocationFilter = (value: LocationWeighted[]) => {
    if (value.length <= 0) {
        return undefined;
    }

    return value.map(locationTransform) || [];
};

const engagementFilter = (value: string | number) => {
    const rate = +(+value / 100).toFixed(2);

    return { value: rate, operator: 'gte' } as z.infer<typeof engagement_rate>;
};

const contactInfoFilter = (value: string[]) => {
    const contactType = value.map((v) => {
        if (v === 'email') {
            return { type: 'email', action: 'should' };
        }
    });

    return contactType.filter((v) => !!v) as z.infer<typeof with_contact>[];
};

const influencerAgeFilter = (value: NullStringTuple) => {
    return leftRightNumberTransform(value);
};

const audienceAgeFilter = (value: z.input<typeof audience_age_range>) => {
    return audience_age_range.parse(value);
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
    body: z.input<typeof SearchInfluencersPayload>['body'];
} => {
    const body: z.infer<typeof SearchInfluencersPayload>['body'] = {
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

    if (params.audienceGender) {
        body.filter.audience_gender = audienceGenderFilter(params.audienceGender);
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

    if (params.views && platform !== 'instagram' && (params.views[0] || params.views[1])) {
        body.filter.views = viewsFilter(params.views);
    }

    if (params.views && platform === 'instagram' && (params.views[0] || params.views[1])) {
        body.filter.reels_plays = viewsFilter(params.views);
    }

    if (params.audience && (params.audience[0] || params.audience[1])) {
        body.filter.followers = audienceFilter(params.audience);
    }

    if (audienceLocation) {
        body.filter.audience_geo = audienceLocationFilter(audienceLocation);
    }

    if (influencerLocation) {
        body.filter.geo = influencerLocationFilter(influencerLocation);
    }

    if (params.lastPost) {
        body.filter.last_posted = lastPostedFilter(+params.lastPost);
    }

    if (params.contactInfo) {
        body.filter.with_contact = contactInfoFilter([params.contactInfo]);
    }

    if (params.influencerAge) {
        body.filter.age = influencerAgeFilter(params.influencerAge);
    }

    if (params.audienceAge) {
        body.filter.audience_age_range = audienceAgeFilter(params.audienceAge);
    }

    if (params.engagement) {
        body.filter.engagement_rate = engagementFilter(params.engagement);
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
