import { headers } from 'src/utils/api/iqdata/constants';
import { handleResError } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorReport, CreatorSearchResult } from 'types';
import type { CreatorReportsMetadata } from 'types/iqdata/creator-reports-metadata';
import type { FetchCreatorsFilteredParams } from './transforms';
import { prepareFetchCreatorsFiltered } from './transforms';

export const IQDATA_URL = 'https://socapi.icu/v2.0/api/';

/**
 *
 * @param path will be prefixed by `https://socapi.icu/v2.0/api/`
 * @returns fetch .json() data
 * @description fetcher for IQData API. API docs: https://iqdata.social/docs/api
 */
export const iqDataFetch = async <T = any>(path: string, options: RequestInit = {}) => {
    const res = await fetch(IQDATA_URL + path, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });
    await handleResError(res);
    const json = await res.json();
    return json as T;
};

export const fetchIqDataLookalike = async (term: string, platform: CreatorPlatform) =>
    await iqDataFetch(`dict/users/?q=${term}&type=lookalike&platform=${platform}&limit=5`);

export const fetchIqDataTopics = async (term: string, platform: CreatorPlatform, limit = 10) =>
    await iqDataFetch(`dict/topic-tags/?q=${term}&platform=${platform}&limit=${limit}`);

export const fetchIqDataGeos = async (term: string) =>
    await iqDataFetch(`geos/?q=${term}&types=country&limit=5`);

export const fetchCreatorsFiltered = async (params: FetchCreatorsFilteredParams) => {
    const { platform, body } = prepareFetchCreatorsFiltered(params);

    return await iqDataFetch<CreatorSearchResult>(
        `search/newv1?${new URLSearchParams({ platform, auto_unhide: '1' })}`,
        {
            method: 'post',
            body: JSON.stringify(body),
        },
    );
};

export const requestNewReport = async (
    platform: CreatorPlatform,
    id: string,
    subscribe = false,
    dry_run = false,
) =>
    await iqDataFetch<CreatorReport>(
        `reports/new?platform=${platform}&url=${id}&subscribe=${
            subscribe ? 1 : 0
        }&dry_run=${dry_run}`,
    );

export const fetchReport = async (reportId: string) =>
    await iqDataFetch<CreatorReport>(`reports/${reportId}`);

//** omit id to get all previously generated reports of that platform */
export const fetchReportsMetadata = async (platform: CreatorPlatform, creator_id?: string) =>
    await iqDataFetch<CreatorReportsMetadata>(
        `reports?platform=${platform}${creator_id ? `&url=${creator_id}` : ''}`,
    );
