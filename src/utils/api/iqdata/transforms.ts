import { featRecommended } from 'src/constants/feature-flags';
import type { CreatorPlatform, CreatorAccount, LocationWeighted } from 'types';
import type { SearchInfluencersPayload } from './influencers/search-influencers-payload';
import type {
    last_posted,
    audience_age_range,
    audience_gender,
    actions,
} from './influencers/search-influencers-payload';
import type { z } from 'zod';
import {
    audienceFilter,
    audienceGenderFilter,
    audienceLocationFilter,
    genderFilter,
    influencerLocationFilter,
    lastPostedFilter,
    lookalikeFilter,
    tagsFilter,
    textFilter,
    usernameFilter,
    viewsFilter,
    contactInfoFilter,
    influencerAgeFilter,
    audienceAgeFilter,
    engagementFilter,
    recommendedInfluencersFilter,
    keywordsFilter,
    textTagsFilter,
    actionsFilter,
} from './transforms-filters';

type NullStringTuple = [null | string, null | string];

export type FetchCreatorsFilteredParams = {
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
    // @todo may need refactor from frontend to avoid confusion
    // hashtags are also text_tags, you can find this in SearchOptions component
    hashtags?: string[];
};

// eslint-disable-next-line complexity
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
    const actionsFilterKeys = ['keywords', 'username', 'text', 'relevance'];

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

        body.filter.relevance.value += tagsFilter(tags);
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
        const filter = audienceLocationFilter(audienceLocation);

        if (filter) {
            body.filter.audience_geo = filter;
        }
    }

    if (influencerLocation) {
        const filter = influencerLocationFilter(influencerLocation);

        if (filter) {
            body.filter.geo = filter;
        }
    }

    if (params.lastPost) {
        body.filter.last_posted = lastPostedFilter(params.lastPost);
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
        body.filter.filter_ids = recommendedInfluencersFilter(
            params.recommendedInfluencers.filter((influencer) => influencer.split('/')[0] === platform),
        );
    }

    if (params.keywords) {
        body.filter.keywords = keywordsFilter(params.keywords);
    }

    if (params.text_tags || params.hashtags) {
        let text = params.text_tags ? params.text_tags : '';
        text += params.hashtags ? params.hashtags.join(' ') : text;

        body.filter.text_tags = textTagsFilter(text);
    }

    if (actionsFilterKeys.some((k) => body.filter && k in body.filter)) {
        const filters: z.input<typeof actions>[] = [];

        if (params.keywords) {
            filters.push({ filter: 'keywords', action: 'should' });
        }

        if (params.username) {
            filters.push({ filter: 'username', action: 'should' });
        }

        if (params.text) {
            filters.push({ filter: 'text', action: 'should' });
        }

        body.filter.actions = actionsFilter(filters);
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
