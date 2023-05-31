import type { CreatorPlatform, CreatorReport } from 'types';
import { fetchReportsMetadata, requestNewReport, fetchReport as apiFetchReport } from '.';

export const fetchReport = async (influencerId: string, platform: CreatorPlatform) => {
    const response = await fetchReportsMetadata(platform, influencerId);
    let report: CreatorReport | null = null;

    if (response?.results?.length <= 0) {
        report = await requestNewReport(platform, influencerId);
    }

    if (response?.results?.length > 0) {
        report = await apiFetchReport(response.results[0].id);
    }

    return report;
};
