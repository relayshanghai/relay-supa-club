import type { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'src/utils/api/iqdata/constants';
import { handleResError } from 'src/utils/fetcher';
import { rudderstack } from 'src/utils/rudderstack';
import type { CreatorPlatform, CreatorReport, CreatorSearchResult } from 'types';
import type { CreatorReportsMetadata } from 'types/iqdata/creator-reports-metadata';
import type { TikTokVideoDataRaw } from 'types/iqdata/tiktok-video-info';
import type { YoutubeVideoDataRaw } from 'types/iqdata/youtube-video-info';
import type { FetchCreatorsFilteredParams } from './transforms';
import { prepareFetchCreatorsFiltered } from './transforms';
import { logIqdataLimits } from '../forensicTrack';
import { serverLogger } from 'src/utils/logger-server';
import apm from 'elastic-apm-node';
export const IQDATA_URL = 'https://socapi.icu/v2.0/api/';

export type ServerContext = {
    req: NextApiRequest;
    res: NextApiResponse;
    metadata?: {
        [key: string]: any;
    };
};
export const withServerContextIqdata = (fetchFunction: (...args: any[]) => any) => {
    return (context?: ServerContext) => {
        return (...args: any[]) => {
            return fetchFunction(...args, context);
        };
    };
};

export const withServerContext = <T extends (...args: any[]) => any>(fetchFunction: T) => {
    return (args: Parameters<T>[0], context?: ServerContext) => {
        return fetchFunction({ ...args, context }) as ReturnType<T>;
    };
};

export class IQDataApiFetch {
    static service = new IQDataApiFetch();

    /**
     * @deprecated
     * @param path will be prefixed by `https://socapi.icu/v2.0/api/`
     * @returns fetch .json() data
     * @description fetcher for IQData API. API docs: https://iqdata.social/docs/api
     */
    // @UseDistributedQueue(10)
    async request<T = any>(path: string, options: RequestInit & { context?: ServerContext } = {}) {
        const { context, ...strippedOptions } = options;
        const span = apm.startSpan('IQDataApiFetch.request');
        const res = await fetch(IQDATA_URL + path, {
            ...strippedOptions,
            headers: {
                ...headers,
                ...strippedOptions.headers,
            },
        });
        await logIqdataLimits(res, path, context);
        await handleResError(res);
        const json = await res.json();

        if (span) {
            span.setLabel('cost', json.cost, true);
        }
        span?.end();
        if (context) {
            await rudderstack.identify(context);
            const identity = rudderstack.getIdentity();
            try {
                await rudderstack.send(json);
            } catch (error: unknown) {
                serverLogger(error, (scope) => {
                    return scope.setContext('Rudderstack Identity', identity);
                });
            }
        }

        return json as T;
    }
}

//** Search for influencers */
// We are currently using iqdata lookalike api to search for influencers, there is no api available for searching influencers by name.
// Currently IqData has two search options under their lookalikes endpoint:
// 1. Audience lookalike: help you to find influencers with similar audience
// 2. Influencer lookalike: help you to find influencers that post similar content
// These two option returns different data, so we need to use both in our search in order to give customer the best results.
export const fetchIqDataLookalikeByAudience = async (
    term: string,
    platform: CreatorPlatform,
    context?: ServerContext,
) =>
    await IQDataApiFetch.service.request(`dict/users/?q=${term}&type=lookalike&platform=${platform}&limit=5`, {
        context,
    }); //Audience lookalike

export const fetchIqDataLookalikeByInfluencer = async (
    term: string,
    platform: CreatorPlatform,
    context?: ServerContext,
) =>
    await IQDataApiFetch.service.request(`dict/users/?q=${term}&type=topic-tags&platform=${platform}&limit=5`, {
        context,
    }); //Influencer lookalike

export const fetchIqDataTopics = async (term: string, platform: CreatorPlatform, context?: ServerContext, limit = 10) =>
    await IQDataApiFetch.service.request(`dict/topic-tags/?q=${term}&platform=${platform}&limit=${limit}`, { context });

export const fetchIqDataGeos = async (term: string, context?: ServerContext) =>
    await IQDataApiFetch.service.request(`geos/?q=${term}&types=country&limit=5`, { context });

export const fetchCreatorsFiltered = async (params: FetchCreatorsFilteredParams, context?: ServerContext) => {
    const { platform, body } = prepareFetchCreatorsFiltered(params);

    return await IQDataApiFetch.service.request<CreatorSearchResult>(
        `search/newv1?${new URLSearchParams({ platform, auto_unhide: '1' })}`,
        {
            method: 'post',
            body: JSON.stringify(body),
            context,
        },
    );
};

export const requestNewReport = async (
    platform: CreatorPlatform,
    id: string,
    context?: ServerContext,
    subscribe = false,
    dry_run = false,
) =>
    await IQDataApiFetch.service.request<CreatorReport>(
        `reports/new?platform=${platform}&url=${id}&subscribe=${subscribe ? 1 : 0}&dry_run=${dry_run}`,
        { context },
    );

export const fetchReport = async (reportId: string, context?: ServerContext) =>
    await IQDataApiFetch.service.request<CreatorReport>(`reports/${reportId}`, { context });

//** omit id to get all previously generated reports of that platform */
export const fetchReportsMetadata = async (platform: CreatorPlatform, creator_id?: string, context?: ServerContext) =>
    await IQDataApiFetch.service.request<CreatorReportsMetadata>(
        `reports?platform=${platform}${creator_id ? `&url=${creator_id}` : ''}`,
        {
            context,
        },
    );

export const fetchYoutubeVideoInfo = async (videoUrl: string, context?: ServerContext) =>
    await IQDataApiFetch.service.request<YoutubeVideoDataRaw>(
        `raw/yt/video?${new URLSearchParams({ url: videoUrl })}`,
        { context },
    );

export const fetchTiktokVideoInfo = async (videoUrl: string, context?: ServerContext) =>
    await IQDataApiFetch.service.request<TikTokVideoDataRaw>(
        `raw/tt/user/media?${new URLSearchParams({ url: videoUrl })}`,
        { context },
    );

// export const fetchIqDataLookalikeByAudienceWithContext = withServerContextIqdata(fetchIqDataLookalikeByAudience);
// export const fetchIqDataLookalikeByInfluencerWithContext = withServerContextIqdata(fetchIqDataLookalikeByInfluencer);
export const fetchIqDataTopicsWithContext = withServerContextIqdata(fetchIqDataTopics);
export const fetchIqDataGeosWithContext = withServerContextIqdata(fetchIqDataGeos);
// export const fetchCreatorsFilteredWithContext = withServerContextIqdata(fetchCreatorsFiltered);
export const requestNewReportWithContext = withServerContextIqdata(requestNewReport);
export const fetchReportWithContext = withServerContextIqdata(fetchReport);
export const fetchReportsMetadataWithContext = withServerContextIqdata(fetchReportsMetadata);
export const fetchYoutubeVideoInfoWithContext = withServerContextIqdata(fetchYoutubeVideoInfo);
export const fetchTiktokVideoInfoWithContext = withServerContextIqdata(fetchTiktokVideoInfo);
