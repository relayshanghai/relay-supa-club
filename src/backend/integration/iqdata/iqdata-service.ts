import axios from 'axios';
import zlib from 'zlib';
import { type IQDataExportResult } from './export-definition';
const IQDATA_URL = process.env.IQDATA_URL || 'https://socapi.icu/v2.0/api';

export default class IQDataService {
    static service = new IQDataService();
    static getService(): IQDataService {
        return IQDataService.service;
    }
    client = axios.create({
        baseURL: IQDATA_URL,
        headers: {
            'X-Api-Key': process.env.DATA_KEY || '',
            Authorization: `Basic ${Buffer.from(process.env.DATA_USER + ':' + process.env.DATA_PASS).toString(
                'base64',
            )}`,
        },
    });

    async createNewExport(platform: string, influencerIds: string[]): Promise<string> {
        const result = await this.client.post(`/exports/new?platform=${platform}`, {
            filter: {
                with_contact: [
                    {
                        type: 'email',
                        action: 'must',
                    },
                ],
                filter_ids: influencerIds,
            },
            export_type: 'FULL',
            sort: {
                field: 'engagement_rate',
            },
            paging: {
                limit: 1000,
            },
            audience_source: 'any',
        });
        return result.data.export_id;
    }
    async getExportResult(exportId: string): Promise<IQDataExportResult[]> {
        const result = await this.client.get(`/exports/${exportId}/files/json`, {
            responseType: 'arraybuffer',
        });
        const data = zlib.gunzipSync(result.data).toString();
        return data
            .split('\n')
            .map((line: string) => {
                try {
                    return JSON.parse(line);
                } catch (error) {
                    return null;
                }
            })
            .filter((line) => line);
    }
}
