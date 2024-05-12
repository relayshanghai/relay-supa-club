import axios from 'axios';
import { UseLogger } from '../logger/decorator';

export default class BoostbotService {
    static service: BoostbotService = new BoostbotService();
    static getService(): BoostbotService {
        return BoostbotService.service;
    }

    apiClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
        headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
    });

    @UseLogger()
    async triggerSyncEmailAccount(accountId: string) {
        const result = await this.apiClient.get(`/api/sync-email/${accountId}`);
        return result.data;
    }
    @UseLogger()
    async triggerIQDataExport(exportId: string) {
        const result = await this.apiClient.get(`/api/v2/iqdata-export/${exportId}`);
        return result.data;
    }
}
