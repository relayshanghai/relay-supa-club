import type { CreatorPlatform, CreatorReport } from 'types';
import {
    fetchReportsMetadataWithContext,
    requestNewReportWithContext,
    fetchReportWithContext as apiFetchReportWithContext,
} from '.';
import type { NextApiRequest, NextApiResponse } from 'next';

export const fetchReport = async (
    context: { req: NextApiRequest; res: NextApiResponse },
    influencerId: string,
    platform: CreatorPlatform,
) => {
    const response = await fetchReportsMetadataWithContext(context, platform, influencerId);
    let report: CreatorReport | null = null;

    if (response?.results?.length <= 0) {
        report = await requestNewReportWithContext(context, platform, influencerId);
    }

    if (response?.results?.length > 0) {
        report = await apiFetchReportWithContext(context, response.results[0].id);
    }

    return report;
};
