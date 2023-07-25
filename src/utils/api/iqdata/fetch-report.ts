import type { CreatorPlatform, CreatorReport } from 'types';
import {
    fetchReportsMetadataWithContext as fetchReportsMetadata,
    requestNewReportWithContext as requestNewReport,
    fetchReportWithContext as apiFetchReport,
} from '.';
import type { NextApiRequest, NextApiResponse } from 'next';

export const fetchReport = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    influencerId: string,
    platform: CreatorPlatform,
) => {
    const response = await fetchReportsMetadata(context, platform, influencerId);
    let report: CreatorReport | null = null;

    if (response?.results?.length <= 0) {
        report = await requestNewReport(context, platform, influencerId);
    }

    if (response?.results?.length > 0) {
        report = await apiFetchReport(context, response.results[0].id);
    }

    return report;
};
