import { headers as iqdataHeaders } from 'src/utils/api/iqdata/constants';
import { gunzipSync } from 'zlib';
import { merge } from 'lodash';
import type { SocialPlatformID } from '../types';
import {
    SearchInfluencersDefault,
    ListReportsPayloadDefault,
    NewReportPayloadDefault,
    FetchReportPayloadDefault,
    ListUsersPayloadDefault,
} from './constants';
import type {
    ApiResponse,
    ApiPayload,
    SearchInfluencersPayload,
    ListReportsPayload,
    NewReportPayload,
    FetchReportPayload,
    DictionaryType,
    ListUsersPayload,
    SupportedPlatforms,
} from './types';

export class IQData {
    API_ENDPOINT = 'https://socapi.icu/v2.0/api';

    async searchInfluencers(platform: SupportedPlatforms, searchQuery: string, payload?: SearchInfluencersPayload) {
        const query = merge(SearchInfluencersDefault.query, payload?.query);
        query.platform = platform;

        const body = merge(SearchInfluencersDefault.body, payload?.body);
        body.filter.keywords = searchQuery;

        const response = await this._fetch('/search/newv1', { query, body });

        return response;
    }

    async listReports(id: SocialPlatformID, payload?: ListReportsPayload) {
        const query = merge(ListReportsPayloadDefault.query, payload?.query);
        query.url = id[0];
        query.platform = id[1];

        const response = await this._fetch('/reports', { query });

        return response;
    }

    async newReport(id: SocialPlatformID, payload?: NewReportPayload) {
        const query = merge(NewReportPayloadDefault.query, payload?.query);
        query.url = id[0];
        query.platform = id[1];
        query.dry_run = false;

        const response = await this._fetch('/reports/new', { query }, { method: 'POST' });

        return response;
    }

    async fetchReport(id: string, payload?: FetchReportPayload) {
        const path = merge(FetchReportPayloadDefault.path, payload?.path);
        path.report_id = id;

        const response = await this._fetch('/reports/{report_id}', { path });

        return response;
    }

    async listUsers(dictType: DictionaryType, payload?: ListUsersPayload) {
        const query = merge(ListUsersPayloadDefault.query, payload?.query);
        query.type = dictType;

        const response = await this._fetch('/dict/users', { query });

        return response;
    }

    // @todo: this can be a reusable function for calling apis
    async _fetch<T = ApiResponse>(path: string, payload: ApiPayload, options: RequestInit = {}) {
        path = path.replace(/^\//g, '');
        const urlParams = new URLSearchParams(payload.query).toString();

        if (payload.path) {
            for (const [key, value] of Object.entries(payload.path)) {
                path = path.replace(`{${key}}`, value);
            }
        }

        if (urlParams !== '') {
            path = `${path}?${urlParams}`;
        }

        options = {
            ...options,
            headers: {
                ...iqdataHeaders,
                ...options.headers,
            },
        };

        if (payload.body) {
            options.method = 'POST';
            options.body = JSON.stringify(payload.body);
        }

        const response = await fetch(`${this.API_ENDPOINT}/${path}`, options).catch((err) => {
            return new Error(err);
        });

        if (response instanceof Error) {
            throw response;
        }

        let content = null;

        const contentType = response.headers.get('content-type') || '';

        if (!response.bodyUsed && contentType.indexOf('application/json') !== -1) {
            content = await response.json();
        }

        if (!response.bodyUsed && contentType.indexOf('x-gzip') !== -1) {
            const buffer = await response.arrayBuffer();
            content = gunzipSync(buffer).toString('utf8');
            content = content.trim().replace(/\n/g, ',');
            content = JSON.parse(`[${content}]`);
        }

        if (!response.bodyUsed && contentType.indexOf('application/json') === -1) {
            content = await response.text();
        }

        return content as T;
    }
}
