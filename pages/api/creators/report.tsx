import { NextApiRequest, NextApiResponse } from 'next';
import { fetchReport, fetchReportsMetadata, requestNewReport } from 'src/utils/api/iqdata';
import { nextFetch } from 'src/utils/fetcher';
import { CreatorReport, CreatorReportsMetadata } from 'types';

export const nextFetchReportMetadata = async (platform: string, user_id: string) =>
    await nextFetch<CreatorReportsMetadata>(
        `creators/report?platform=${platform}&user_id=${user_id}&get_metadata=true`
    );

export const nextFetchReport = async (report_id: string) =>
    await nextFetch<CreatorReport>(`creators/report?report_id=${report_id}`);

export const nextFetchReportNew = async (platform: string, user_id: string) =>
    await nextFetch<CreatorReport>(
        `creators/report?platform=${platform}&user_id=${user_id}&request_new=true`
    );

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { platform, user_id, get_metadata, request_new } = req.query;

            if (request_new === 'true') {
                const data = await requestNewReport(platform as any, user_id as string);
                if (!data.success) throw new Error('Failed to request new report');
                return res.status(200).json(data);
            } else if (get_metadata) {
                const data = await fetchReportsMetadata(platform as any, user_id as string);
                if (!data.results || data.results.length === 0) throw new Error('No reports found');
                return res.status(200).json(data);
            } else {
                const report_id = req.query.report_id as string;
                const data = await fetchReport(report_id);
                if (!data.success) throw new Error('Failed to find report');

                return res.status(200).json(data);
            }
        } catch (error) {}

        return res.status(400).json(null);
    }
}
