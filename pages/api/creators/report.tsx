import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { recordReportUsage } from 'src/utils/api/db/calls/usages';
import {
    fetchReportWithContext as fetchReport,
    fetchReportsMetadataWithContext as fetchReportsMetadata,
    requestNewReportWithContext as requestNewReport,
} from 'src/utils/api/iqdata';
import { getInfluencer } from 'src/utils/get-influencer';
import { serverLogger } from 'src/utils/logger-server';
import { saveInfluencer } from 'src/utils/save-influencer';
import type { CreatorPlatform, CreatorReport } from 'types';
import { db } from 'src/utils/supabase-client';

export type CreatorsReportGetQueries = {
    platform: CreatorPlatform;
    creator_id: string;
    company_id: string;
    user_id: string;
};

export type CreatorsReportGetResponse = CreatorReport & { createdAt: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const catchInfluencer = async (data: CreatorReport) => {
            const [influencer] = await getInfluencer(data);

            if (influencer === null) {
                await db<typeof saveInfluencer>(saveInfluencer)(data);
            }
        };

        try {
            const { platform, creator_id, company_id, user_id } = req.query as CreatorsReportGetQueries;
            if (!platform || !creator_id || !company_id || !user_id)
                return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid request' });

            try {
                const reportMetadata = await fetchReportsMetadata({ req, res }, platform, creator_id);
                if (!reportMetadata.results || reportMetadata.results.length === 0) throw new Error('No reports found');
                const report_id = reportMetadata.results[0].id;
                if (!report_id) throw new Error('No report ID found');
                const createdAt = reportMetadata.results[0].created_at;
                const data = await fetchReport({ req, res }, report_id);
                if (!data.success) throw new Error('Failed to find report');

                const { error: recordError } = await recordReportUsage(company_id, user_id, creator_id);
                if (recordError) {
                    serverLogger(recordError, 'error');
                    return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
                }

                try {
                    await catchInfluencer(data);
                } catch (error) {
                    serverLogger(error, 'error', true);
                }

                return res.status(httpCodes.OK).json({ ...data, createdAt });
            } catch (error) {
                const data = await requestNewReport({ req, res }, platform, creator_id);
                if (!data.success) throw new Error('Failed to request new report');

                const { error: recordError } = await recordReportUsage(company_id, user_id, creator_id);
                if (recordError) {
                    serverLogger(recordError, 'error');
                    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
                }

                try {
                    await catchInfluencer(data);
                } catch (error) {
                    serverLogger(error, 'error', true);
                }

                return res.status(httpCodes.OK).json(data);
            }
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
