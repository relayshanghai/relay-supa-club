import { getUserSession } from './../analytics';
import { headers } from 'src/utils/api/iqdata/constants';
import { handleResError } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorReport, CreatorSearchResult, DatabaseWithCustomTypes } from 'types';
import type { CreatorReportsMetadata } from 'types/iqdata/creator-reports-metadata';
import type { FetchCreatorsFilteredParams } from './transforms';
import { prepareFetchCreatorsFiltered } from './transforms';
import type { TikTokVideoDataRaw } from 'types/iqdata/tiktok-video-info';
import type { YoutubeVideoDataRaw } from 'types/iqdata/youtube-video-info';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
export const IQDATA_URL = 'https://socapi.icu/v2.0/api/';

export const withServerContextIqdata = (fetchFunction: (...args: any[]) => any) => {
    return (context: { req: NextApiRequest; res: NextApiResponse }, ...args: any[]) => {
        return fetchFunction(context, ...args);
    };
};

export const withServerContext = (fetchFunction: (args: any) => any) => {
    return (context: { req: NextApiRequest; res: NextApiResponse }, args: any) => {
        args.context = context;
        return fetchFunction(args);
    };
};

/**
 *
 * @param path will be prefixed by `https://socapi.icu/v2.0/api/`
 * @returns fetch .json() data
 * @description fetcher for IQData API. API docs: https://iqdata.social/docs/api
 */
export const iqDataFetch = async <T = any>(
    path: string,
    context: { req: NextApiRequest; res: NextApiResponse },
    options: RequestInit = {},
) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
    const { user_id, company_id } = await getUserSession(supabase)();
    const res = await fetch(IQDATA_URL + path, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });
    await handleResError(res, path, { user_id, company_id });
    const json = await res.json();
    return json as T;
};

//** Search for influencers */
// We are currently using iqdata lookalike api to search for influencers, there is no api available for searching influencers by name.
// Currently IqData has two search options under their lookalikes endpoint:
// 1. Audience lookalike: help you to find influencers with similar audience
// 2. Influencer lookalike: help you to find influencers that post similar content
// These two option returns different data, so we need to use both in our search in order to give customer the best results.
export const fetchIqDataLookalikeByAudience = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    term: string,
    platform: CreatorPlatform,
) => await iqDataFetch(`dict/users/?q=${term}&type=lookalike&platform=${platform}&limit=5`, context); //Audience lookalike

export const fetchIqDataLookalikeByInfluencer = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    term: string,
    platform: CreatorPlatform,
) => await iqDataFetch(`dict/users/?q=${term}&type=topic-tags&platform=${platform}&limit=5`, context); //Influencer lookalike

export const fetchIqDataTopics = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    term: string,
    platform: CreatorPlatform,
    limit = 10,
) => await iqDataFetch(`dict/topic-tags/?q=${term}&platform=${platform}&limit=${limit}`, context);

export const fetchIqDataGeos = async (context: { req: NextApiRequest; res: NextApiResponse }, term: string) =>
    await iqDataFetch(`geos/?q=${term}&types=country&limit=5`, context);

export const fetchCreatorsFiltered = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    params: FetchCreatorsFilteredParams,
) => {
    const { platform, body } = prepareFetchCreatorsFiltered(params);

    return await iqDataFetch<CreatorSearchResult>(
        `search/newv1?${new URLSearchParams({ platform, auto_unhide: '1' })}`,
        context,
        {
            method: 'post',
            body: JSON.stringify(body),
        },
    );
};

export const requestNewReport = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    platform: CreatorPlatform,
    id: string,
    subscribe = false,
    dry_run = false,
) =>
    await iqDataFetch<CreatorReport>(
        `reports/new?platform=${platform}&url=${id}&subscribe=${subscribe ? 1 : 0}&dry_run=${dry_run}`,
        context,
    );

export const fetchReport = async (context: { req: NextApiRequest; res: NextApiResponse }, reportId: string) =>
    await iqDataFetch<CreatorReport>(`reports/${reportId}`, context);

//** omit id to get all previously generated reports of that platform */
export const fetchReportsMetadata = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    platform: CreatorPlatform,
    creator_id?: string,
) =>
    await iqDataFetch<CreatorReportsMetadata>(
        `reports?platform=${platform}${creator_id ? `&url=${creator_id}` : ''}`,
        context,
    );

export const fetchYoutubeVideoInfo = async (context: { req: NextApiRequest; res: NextApiResponse }, videoUrl: string) =>
    await iqDataFetch<YoutubeVideoDataRaw>(`raw/yt/video?${new URLSearchParams({ url: videoUrl })}`, context);

export const fetchTiktokVideoInfo = async (context: { req: NextApiRequest; res: NextApiResponse }, videoUrl: string) =>
    await iqDataFetch<TikTokVideoDataRaw>(`raw/tt/user/media?${new URLSearchParams({ url: videoUrl })}`, context);

export const fetchIqDataLookalikeByAudienceWithContext = withServerContextIqdata(fetchIqDataLookalikeByAudience);
export const fetchIqDataLookalikeByInfluencerWithContext = withServerContextIqdata(fetchIqDataLookalikeByInfluencer);
export const fetchIqDataTopicsWithContext = withServerContextIqdata(fetchIqDataTopics);
export const fetchIqDataGeosWithContext = withServerContextIqdata(fetchIqDataGeos);
export const fetchCreatorsFilteredWithContext = withServerContextIqdata(fetchCreatorsFiltered);
export const requestNewReportWithContext = withServerContextIqdata(requestNewReport);
export const fetchReportWithContext = withServerContextIqdata(fetchReport);
export const fetchReportsMetadataWithContext = withServerContextIqdata(fetchReportsMetadata);
export const fetchYoutubeVideoInfoWithContext = withServerContextIqdata(fetchYoutubeVideoInfo);
export const fetchTiktokVideoInfoWithContext = withServerContextIqdata(fetchTiktokVideoInfo);
