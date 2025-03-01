import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';
import { flattenInfluencerData } from 'src/utils/api/boostbot/helper';
import { recordSearchUsage } from 'src/utils/api/db/calls/usages';
import {
    type SearchInfluencersPayloadInput,
    searchInfluencersWithContext as searchInfluencers,
} from 'src/utils/api/iqdata/influencers/search-influencers';
import type { SearchInfluencersPayload } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';
import { prepareFetchCreatorsFiltered } from 'src/utils/api/iqdata/transforms';
import { IQDATA_SEARCH_INFLUENCERS, rudderstack } from 'src/utils/rudderstack';
import { hasCustomSearchParams } from 'src/utils/usagesHelpers';
import type { CreatorSearchResult } from 'types';
import type { z } from 'zod';

export type InfluencerPostRequest = FetchCreatorsFilteredParams & {
    company_id: string;
    user_id: string;
};
export type InfluencerPostResponse = CreatorSearchResult;

// eslint-disable-next-line complexity
const generateFiltersMixpanelPayload = (
    body: z.input<typeof SearchInfluencersPayload>['body'],
    searchParams: FetchCreatorsFilteredParams,
) => {
    if (!body) return {};

    const textTagsValue = body.filter?.text_tags
        ? (body.filter?.text_tags).filter((v) => !!v.value).map((v) => v.value)
        : [];

    const audienceGeoCodes = searchParams.audienceLocation
        ? searchParams.audienceLocation.map((v) => v.country.code)
        : [];

    const geoCodes = searchParams.influencerLocation ? searchParams.influencerLocation.map((v) => v.country.code) : [];

    const engagementRate = body.filter?.engagement_rate
        ? `${body.filter?.engagement_rate?.operator}${body.filter?.engagement_rate}`
        : undefined;

    const relevance = body.filter?.relevance ? body.filter?.relevance.value.split(' ') : undefined;

    const filters = {
        filter_keywords: body.filter?.keywords || undefined,
        filter_text: body.filter?.text || undefined,
        filter_relevance: relevance,
        filter_gender: body.filter?.gender?.code || undefined,
        filter_audienceGender: body.filter?.audience_gender?.code || undefined,
        filter_username: body.filter?.username || undefined,
        filter_views_min: body.filter?.views?.left_number || undefined,
        filter_views_max: body.filter?.views?.right_number || undefined,
        filter_reelsPlays_min: body.filter?.reels_plays?.left_number || undefined,
        filter_reelsPlays_max: body.filter?.reels_plays?.right_number || undefined,
        filter_followers_min: body.filter?.followers?.left_number || undefined,
        filter_followers_max: body.filter?.followers?.right_number || undefined,
        filter_lastPosted: body.filter?.last_posted || undefined,
        filter_age_min: body.filter?.age?.left_number || undefined,
        filter_age_max: body.filter?.age?.right_number || undefined,
        filter_audienceAge_min: body.filter?.audience_age_range?.left_number || undefined,
        filter_audienceAge_max: body.filter?.audience_age_range?.right_number || undefined,
        filter_engagementRate: engagementRate,
        filter_textTags: textTagsValue.length > 0 ? textTagsValue : undefined,
        filter_audienceGeo: audienceGeoCodes.length > 0 ? audienceGeoCodes : undefined,
        filter_geo: geoCodes.length > 0 ? geoCodes : undefined,
    };

    return filters;
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { company_id, user_id, ...searchParams } = req.body as InfluencerPostRequest;

    if (!company_id || !user_id) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    if (hasCustomSearchParams(searchParams)) {
        const { error: recordError } = await recordSearchUsage(company_id, user_id);
        if (recordError) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
        }
    }

    const { platform, body } = prepareFetchCreatorsFiltered(searchParams);

    const parameters: SearchInfluencersPayloadInput = {
        query: { platform },
        body: {
            ...body,
            filter: {
                followers_growth: {
                    interval: 'i3months',
                    operator: 'gte',
                    value: 0,
                },
                /**
                 * remove language filter
                 */
                posts_count: {
                    left_number: 0,
                },
                ...body?.filter,
            },
        },
    };

    await rudderstack.identify({ req, res });

    rudderstack.track({
        event: IQDATA_SEARCH_INFLUENCERS,
        onTrack: (data) => {
            if (data.total === undefined) return false;
            const filters = body ? generateFiltersMixpanelPayload(body, searchParams) : {};

            return {
                total: data.total,
                shown_accounts: data.shown_accounts,
                paid: true,
                cost: data.cost,
                platform,
                page: searchParams.page,
                ...filters,
            };
        },
    });

    const results = await searchInfluencers(parameters, { req, res });

    const structuredResults = flattenInfluencerData(results, ['search']);

    /**
     * removing snapshots
     */
    return res.status(httpCodes.OK).json(structuredResults);
};

export default ApiHandlerWithContext({
    postHandler,
});
