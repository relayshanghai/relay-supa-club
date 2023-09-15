import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { createReportSnapshot, createTrack } from 'src/utils/analytics/api/analytics';
import type { eventKeys } from 'src/utils/analytics/events';
import events, { SearchAnalyzeInfluencer } from 'src/utils/analytics/events';
import { recordReportUsage } from 'src/utils/api/db/calls/usages';
import {
    fetchReportWithContext as fetchReport,
    fetchReportsMetadataWithContext as fetchReportsMetadata,
    requestNewReportWithContext as requestNewReport,
} from 'src/utils/api/iqdata';
import { serverLogger } from 'src/utils/logger-server';
import { saveInfluencer } from 'src/utils/save-influencer';
import { db } from 'src/utils/supabase-client';
import type { CreatorPlatform, CreatorReport } from 'types';

import { usageErrors } from 'src/errors/usages';
import type { InfluencerRow, InfluencerSocialProfileRow } from 'src/utils/api/db';
import {
    IQDATA_CREATE_NEW_REPORT,
    IQDATA_FETCH_REPORT_FILE,
    IQDATA_LIST_REPORTS,
    rudderstack,
} from 'src/utils/rudderstack';

export type CreatorsReportGetQueries = {
    platform: CreatorPlatform;
    creator_id: string;
    company_id: string;
    user_id: string;
    track?: eventKeys | undefined;
    source?: 'boostbot' | 'default';
};

const trackAndSnap = async (
    track: eventKeys | undefined,
    req: NextApiRequest,
    res: NextApiResponse,
    eventsObject: typeof events,
    data: CreatorReport,
) => {
    if (track !== SearchAnalyzeInfluencer.eventName) {
        return;
    }
    const result = await createTrack({ req, res })(eventsObject[track]);

    await createReportSnapshot(
        { req, res },
        {
            parameters: req.body,
            results: data,
            event_id: result.id,
        },
    );
};

export type CreatorsReportGetResponse = CreatorReport & { createdAt: string } & {
    influencer: InfluencerRow;
    socialProfile: InfluencerSocialProfileRow;
};

// Disabling complexity linting error as fixing this will require a large refactor
// eslint-disable-next-line complexity
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const catchInfluencer = async (data: CreatorReport) => {
            try {
                const [influencer, socialProfile] = await db<typeof saveInfluencer>(saveInfluencer)(data);
                return { influencer, socialProfile };
            } catch (error) {
                serverLogger(error);
            }

            return { influencer: null, socialProfile: null };
        };

        await rudderstack.identify({ req, res });
        const { source = 'default' } = req.query as CreatorsReportGetQueries;

        try {
            const { platform, creator_id, company_id, user_id, track } = req.query as CreatorsReportGetQueries;
            if (!platform || !creator_id || !company_id || !user_id)
                return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid request' });

            try {
                rudderstack.track({
                    event: IQDATA_LIST_REPORTS,
                    onTrack: (data) => {
                        if (!data.results) return false;

                        return {
                            platform,
                            influencer_id: creator_id,
                            report_id: data.results[0].id,
                        };
                    },
                });

                const reportMetadata = await fetchReportsMetadata({
                    req,
                    res,
                })(platform, creator_id);
                if (!reportMetadata.results || reportMetadata.results.length === 0) throw new Error('No reports found');
                const report_id = reportMetadata.results[0].id;
                if (!report_id) throw new Error('No report ID found');
                const createdAt = reportMetadata.results[0].created_at;

                rudderstack.track({
                    event: IQDATA_FETCH_REPORT_FILE,
                    onTrack: () => {
                        return {
                            platform,
                            influencer_id: creator_id,
                            report_id,
                        };
                    },
                });

                const data: CreatorReport = await fetchReport({ req, res })(report_id);

                if (!data.success) throw new Error('Failed to find report');

                if (source === 'default') {
                    const { error: recordError } = await recordReportUsage(company_id, user_id, creator_id);
                    if (recordError) {
                        serverLogger(recordError, 'error');
                        return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
                    }
                }

                const { influencer, socialProfile } = await catchInfluencer(data);

                await trackAndSnap(track, req, res, events, data);

                return res.status(httpCodes.OK).json({ ...data, createdAt, influencer, socialProfile });
            } catch (error) {
                rudderstack.track({
                    event: IQDATA_CREATE_NEW_REPORT,
                    onTrack: (data) => {
                        if (!data.report_info) return false;

                        return {
                            platform,
                            influencer_id: creator_id,
                            created_at: data.report_info.created,
                            paid: true,
                            cost: 1,
                        };
                    },
                });

                const data = await requestNewReport({ req, res })(platform, creator_id);

                if (!data.success) throw new Error('Failed to request new report');

                if (source === 'default') {
                    const { error: recordError } = await recordReportUsage(company_id, user_id, creator_id);
                    if (recordError) {
                        if (Object.values(usageErrors).includes(recordError)) {
                            return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
                        }
                        serverLogger(recordError, 'error');
                        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
                    }
                }

                const { influencer, socialProfile } = await catchInfluencer(data);

                await trackAndSnap(track, req, res, events, data);

                return res.status(httpCodes.OK).json({ ...data, influencer, socialProfile });
            }
        } catch (error) {
            if ((error as Record<string, unknown>).error === 'retry_later') {
                return res.status(httpCodes.OK).json({ error: 'retry_later' });
            }
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
