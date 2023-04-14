import type { DataSourceFilters, DataSourceInterface, SocialPlatformID } from '../types';
import { IQData } from '../iqdata/iqdata';
import type { ApiResponse } from '../iqdata/types';

export class IQDataDriver implements DataSourceInterface<IQDataDriver> {
    protected iqdata: IQData;

    constructor(iqdata?: IQData) {
        this.iqdata = iqdata || new IQData();
    }

    getSourceName() {
        return 'iqdata';
    }

    async getInfluencer(id: SocialPlatformID) {
        const response = await this.iqdata.listReports(id);
        let report: ApiResponse | null = null;

        if (response?.results?.length <= 0) {
            report = await this.iqdata.newReport(id);
        }

        if (response?.results?.length > 0) {
            report = await this.iqdata.fetchReport(response.results[0].id);
        }

        return report;
    }

    async searchInfluencers(query: string, filters: DataSourceFilters) {
        const { platform } = filters;

        const response = await this.iqdata.searchInfluencers(platform, query);

        return response;
    }
}
