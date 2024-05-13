import axios from 'axios';
import type { CreatorReport } from 'types';
import type { CreatorReportsMetadataResult } from 'types';
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
    async getReportMetaData(platform: string, userId: string): Promise<CreatorReportsMetadataResult> {
        const response = await this.client.get(`/reports?platform=${platform}${userId ? `&url=${userId}` : ''}`);
        return response.data?.results[0] || null;
    }

    async requestNewReport(platform: string, id: string, subscribe = false, dry_run = false): Promise<CreatorReport> {
        const response = await this.client.post(
            `/reports/new?platform=${platform}&url=${id}&subscribe=${subscribe ? 1 : 0}&dry_run=${dry_run}`,
        );
        return response.data;
    }
    async getReport(id: string): Promise<CreatorReport> {
        const response = await this.client.get(`/reports/${id}`);
        return response.data;
    }
}
