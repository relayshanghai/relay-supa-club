import { NextApiRequest, NextApiResponse } from 'next';
import { recordReportUsage } from 'src/utils/api/db/usages';
import { fetchReport, fetchReportsMetadata, requestNewReport } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { platform, creator_id, company_id, user_id } = req.query;
            if (
                !platform ||
                typeof platform !== 'string' ||
                !creator_id ||
                typeof creator_id !== 'string' ||
                !company_id ||
                typeof company_id !== 'string' ||
                !user_id ||
                typeof user_id !== 'string'
            )
                return res.status(400).json({ error: 'Invalid request' });
            try {
                const reportMetadata = await fetchReportsMetadata(platform as any, creator_id);
                if (!reportMetadata.results || reportMetadata.results.length === 0)
                    throw new Error('No reports found');
                const report_id = reportMetadata.results[0].id;
                if (!report_id) throw new Error('No report ID found');
                const createdAt = reportMetadata.results[0].created_at;
                const data = await fetchReport(report_id);
                if (!data.success) throw new Error('Failed to find report');

                const { error: recordError } = await recordReportUsage(
                    company_id,
                    user_id,
                    creator_id
                );
                if (recordError) res.status(500).json({ error: recordError });

                return res.status(200).json({ ...data, createdAt });
            } catch (error) {
                const data = await requestNewReport(platform as any, creator_id);
                if (!data.success) throw new Error('Failed to request new report');

                const { error: recordError } = await recordReportUsage(
                    company_id,
                    user_id,
                    creator_id
                );
                if (recordError) res.status(500).json({ error: recordError });

                return res.status(200).json(data);
            }
        } catch (error: any) {
            return res.status(400).json({ error: "Couldn't fetch report" });
        }
    }

    return res.status(400).json(null);
}
