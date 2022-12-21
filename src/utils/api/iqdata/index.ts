import { headers } from 'src/utils/api/constants';
import { CreatorPlatform } from 'types';
import { FetchCreatorsFilteredParams, prepareFetchCreatorsFiltered } from './transforms';

/**
 *
 * @param path will be prefixed by `https://socapi.icu/v2.0/api/`
 * @returns fetch .json() data
 * @description fetcher for IQData API. API docs: https://iqdata.social/docs/api
 */
export const iqDataFetch = async (
    /** will be prefixed by `https://socapi.icu/v2.0/api/` */
    path: string,
    options: RequestInit = {}
) => {
    const res = await fetch('https://socapi.icu/v2.0/api/' + path, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
    return await res.json();
};

export const fetchIqDataGeos = async (term: string) =>
    await iqDataFetch(`geos/?q=${term}&types=country&limit=5`);

export const fetchCreatorsFiltered = async (params: FetchCreatorsFilteredParams) => {
    const { platform, body } = prepareFetchCreatorsFiltered(params);

    return await iqDataFetch(`search/newv1?platform=${platform}&auto_unhide=1`, {
        method: 'post',
        body: JSON.stringify(body)
    });
};

export const requestNewReport = async (
    platform: CreatorPlatform,
    id: string,
    subscribe = false,
    dry_run = false
) =>
    await iqDataFetch(
        `reports/new?platform=${platform}&url=${id}&subscribe=${
            subscribe ? 1 : 0
        }&dry_run=${dry_run}`
    );

export const fetchReport = async (platform: CreatorPlatform, id: string) =>
    await iqDataFetch(`reports?platform=${platform}&url=${id}`);
