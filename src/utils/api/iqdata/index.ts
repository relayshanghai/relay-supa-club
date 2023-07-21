import { headers } from 'src/utils/api/iqdata/constants';
import { handleResError } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorReport, CreatorSearchResult } from 'types';
import type { CreatorReportsMetadata } from 'types/iqdata/creator-reports-metadata';
import type { FetchCreatorsFilteredParams } from './transforms';
import { prepareFetchCreatorsFiltered } from './transforms';
import type { TikTokVideoDataRaw } from 'types/iqdata/tiktok-video-info';
import type { YoutubeVideoDataRaw } from 'types/iqdata/youtube-video-info';
export const IQDATA_URL = 'https://socapi.icu/v2.0/api/';

/**
 *
 * @param path will be prefixed by `https://socapi.icu/v2.0/api/`
 * @returns fetch .json() data
 * @description fetcher for IQData API. API docs: https://iqdata.social/docs/api
 */
export const iqDataFetch = async <T = any>(path: string, action: string, options: RequestInit = {}) => {
    const res = await fetch(IQDATA_URL + path, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });
    await handleResError(res, action);
    const json = await res.json();
    return json as T;
};

//** Search for influencers */
// We are currently using iqdata lookalike api to search for influencers, there is no api available for searching influencers by name.
// Currently IqData has two search options under their lookalikes endpoint:
// 1. Audience lookalike: help you to find influencers with similar audience
// 2. Influencer lookalike: help you to find influencers that post similar content
// These two option returns different data, so we need to use both in our search in order to give customer the best results.
export const fetchIqDataLookalikeByAudience = async (term: string, platform: CreatorPlatform) =>
    await iqDataFetch(
        `dict/users/?q=${term}&type=lookalike&platform=${platform}&limit=5`,
        fetchIqDataLookalikeByAudience.name,
    ); //Audience lookalike

export const fetchIqDataLookalikeByInfluencer = async (term: string, platform: CreatorPlatform) =>
    await iqDataFetch(
        `dict/users/?q=${term}&type=topic-tags&platform=${platform}&limit=5`,
        fetchIqDataLookalikeByInfluencer.name,
    ); //Influencer lookalike

export const fetchIqDataTopics = async (term: string, platform: CreatorPlatform, limit = 10) =>
    await iqDataFetch(`dict/topic-tags/?q=${term}&platform=${platform}&limit=${limit}`, fetchIqDataTopics.name);

export const fetchIqDataGeos = async (term: string) =>
    await iqDataFetch(`geos/?q=${term}&types=country&limit=5`, fetchIqDataGeos.name);

export const fetchCreatorsFiltered = async (params: FetchCreatorsFilteredParams) => {
    const { platform, body } = prepareFetchCreatorsFiltered(params);

    return await iqDataFetch<CreatorSearchResult>(
        `search/newv1?${new URLSearchParams({ platform, auto_unhide: '1' })}`,
        fetchCreatorsFiltered.name,
        {
            method: 'post',
            body: JSON.stringify(body),
        },
    );
};

export const requestNewReport = async (platform: CreatorPlatform, id: string, subscribe = false, dry_run = false) =>
    await iqDataFetch<CreatorReport>(
        `reports/new?platform=${platform}&url=${id}&subscribe=${subscribe ? 1 : 0}&dry_run=${dry_run}`,
        requestNewReport.name,
    );

export const fetchReport = async (reportId: string) =>
    await iqDataFetch<CreatorReport>(`reports/${reportId}`, fetchReport.name);

//** omit id to get all previously generated reports of that platform */
export const fetchReportsMetadata = async (platform: CreatorPlatform, creator_id?: string) =>
    await iqDataFetch<CreatorReportsMetadata>(
        `reports?platform=${platform}${creator_id ? `&url=${creator_id}` : ''}`,
        fetchReportsMetadata.name,
    );

export const fetchYoutubeVideoInfo = async (videoUrl: string) =>
    await iqDataFetch<YoutubeVideoDataRaw>(
        `raw/yt/video?${new URLSearchParams({ url: videoUrl })}`,
        fetchYoutubeVideoInfo.name,
    );

export const fetchTiktokVideoInfo = async (videoUrl: string) =>
    await iqDataFetch<TikTokVideoDataRaw>(
        `raw/tt/user/media?${new URLSearchParams({ url: videoUrl })}`,
        fetchTiktokVideoInfo.name,
    );
