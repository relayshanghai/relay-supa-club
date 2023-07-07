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
    withRudderStack,
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

        body.filter.relevance.value += ' ' + withRudderStack(tagsFilter, 'Search Options, changed active tags')(tags);
    }

    if (lookalike.length > 0) {
        if (!body.filter.relevance) {
            body.filter.relevance = { value: '' };
        }

        body.filter.relevance.value +=
            ' ' + withRudderStack(lookalikeFilter, 'Search Filters Modal, changed lookalike filter')(lookalike);
    }

    if (params.gender) {
        body.filter.gender = withRudderStack(
            genderFilter,
            'Search Filters Modal, changed influencer gender',
        )(params.gender);
    }

    if (params.audienceGender) {
        body.filter.audience_gender = withRudderStack(
            audienceGenderFilter,
            'Search Filters Modal, changed audience gender',
        )(params.audienceGender);
    }

    if (params.text) {
        body.filter.text = withRudderStack(textFilter, 'Search Filters Modal, changed text requirement')(params.text);
    }

    if (params.username) {
        body.filter.username = withRudderStack(
            usernameFilter,
            'Search Page, changed influencer username filter',
        )(params.username);
    }

    if (params.views && platform !== 'instagram' && (params.views[0] || params.views[1])) {
        body.filter.views = withRudderStack(
            viewsFilter,
            'Search Filters Modal, changed views requirement',
        )(params.views);
    }

    if (params.views && platform === 'instagram' && (params.views[0] || params.views[1])) {
        body.filter.reels_plays = withRudderStack(
            viewsFilter,
            'Search Filters Modal, changed views requirement',
        )(params.views);
    }

    if (params.audience && (params.audience[0] || params.audience[1])) {
        body.filter.followers = withRudderStack(
            audienceFilter,
            'Search Filters Modal, changed followers requirement',
        )(params.audience);
    }

    if (audienceLocation) {
        const filter = withRudderStack(
            audienceLocationFilter,
            'Search Filters Modal, changed audience location',
        )(audienceLocation);

        if (filter) {
            body.filter.audience_geo = filter;
        }
    }

    if (influencerLocation) {
        const filter = withRudderStack(
            influencerLocationFilter,
            'Search Filters Modal, changed influencer location',
        )(influencerLocation);

        if (filter) {
            body.filter.geo = filter;
        }
    }

    if (params.lastPost) {
        body.filter.last_posted = withRudderStack(
            lastPostedFilter,
            'Search Filters Modal, changed last posted date requirement',
        )(params.lastPost);
    }

    if (params.contactInfo) {
        body.filter.with_contact = withRudderStack(
            contactInfoFilter,
            'Search Filters Modal, changed emailID requirement',
        )([params.contactInfo]);
    }

    if (params.influencerAge) {
        body.filter.age = withRudderStack(
            influencerAgeFilter,
            'Search Filters Modal, changed influencer age requirement',
        )(params.influencerAge);
    }

    if (params.audienceAge) {
        body.filter.audience_age_range = withRudderStack(
            audienceAgeFilter,
            'Search Filters Modal, changed audience age requirement',
        )(params.audienceAge);
    }

    if (params.engagement) {
        body.filter.engagement_rate = withRudderStack(
            engagementFilter,
            'Search Filters Modal, changed engagement rate requirement',
        )(params.engagement);
    }

    if (params.only_recommended && params.recommendedInfluencers && featRecommended()) {
        body.filter.filter_ids = withRudderStack(
            recommendedInfluencersFilter,
            'Search Filters Modal, changed recommended requirement',
        )(params.recommendedInfluencers.filter((influencer) => influencer.split('/')[0] === platform));
    }

    if (params.keywords) {
        body.filter.keywords = withRudderStack(keywordsFilter, 'Search Options, changed keywords')(params.keywords);
    }

    if (params.text_tags) {
        body.filter.text_tags = withRudderStack(textTagsFilter, 'Search Options, changed hashtags')(params.text_tags);
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

        body.filter.actions = withRudderStack(
            actionsFilter,
            'Search Filters Modal, changed actions requirement',
        )(filters);
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
