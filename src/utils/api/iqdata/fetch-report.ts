import type { CreatorPlatform, CreatorReport } from 'types';
import {
    fetchReportsMetadataWithContext as fetchReportsMetadata,
    requestNewReportWithContext as requestNewReport,
    fetchReportWithContext as apiFetchReport,
} from '.';
import type { ServerContext } from '.';

export const fetchReport = async (influencerId: string, platform: CreatorPlatform, context?: ServerContext) => {
    const response = await fetchReportsMetadata(context)(platform, influencerId);
    let report: CreatorReport | null = null;

    if (response?.results?.length <= 0) {
        report = await requestNewReport(context)(platform, influencerId);
    }

    if (response?.results?.length > 0) {
        report = await apiFetchReport(context)(response.results[0].id);
    }

    return report;
};
