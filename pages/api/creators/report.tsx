import { NextApiRequest, NextApiResponse } from 'next';
import { fetchReport, fetchReportsMetadata, requestNewReport } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { platform, user_id } = req.query;

            try {
                const reportMetadata = await fetchReportsMetadata(
                    platform as any,
                    user_id as string
                );
                if (!reportMetadata.results || reportMetadata.results.length === 0)
                    throw new Error('No reports found');
                const report_id = reportMetadata.results[0].id;
                if (!report_id) throw new Error('No report ID found');
                const createdAt = reportMetadata.results[0].created_at;
                const data = await fetchReport(report_id);
                if (!data.success) throw new Error('Failed to find report');
                return res.status(200).json({ ...data, createdAt });
            } catch (error) {
                const data = await requestNewReport(platform as any, user_id as string);
                if (!data.success) throw new Error('Failed to request new report');
                return res.status(200).json(data);
            }
        } catch (error: any) {
            return res.status(400).json({ error: "Couldn't fetch report" });
        }

        return res.status(400).json(null);
    }

    return res.status(400).json(null);
}
