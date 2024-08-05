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
import type { CreatorPlatform, CreatorReport, CreatorReportsMetadata } from 'types';
import type { InfluencerRow, InfluencerSocialProfileRow } from 'src/utils/api/db';
import {
    IQDATA_CREATE_NEW_REPORT,
    IQDATA_FETCH_REPORT_FILE,
    IQDATA_LIST_REPORTS,
    rudderstack,
} from 'src/utils/rudderstack';
import { ApiHandlerWithContext } from 'src/utils/api-handler';
import { generateUrlIfTiktok } from 'src/utils/outreach/helpers';
import awaitToError from 'src/utils/await-to-error';

export type CreatorsReportGetQueries = {
    platform: CreatorPlatform;
    creator_id: string;
    company_id: string;
    user_id: string;
    track?: eventKeys | undefined;
    source?: 'boostbot' | 'default';
    pageUrl?: string;
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

    if (result === false) return;

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
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const tryToSaveInfluencer = async (data: CreatorReport) => {
        try {
            const [influencer, socialProfile] = await db<typeof saveInfluencer>(saveInfluencer)(data);
            return { influencer, socialProfile };
        } catch (error) {
            serverLogger(error);
        }

        return { influencer: null, socialProfile: null };
    };

    await rudderstack.identify({ req, res });

    const { platform, creator_id, company_id, user_id, track, pageUrl } = req.query as CreatorsReportGetQueries;
    if (!platform || !creator_id || !company_id || !user_id)
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid request' });

    const trackListReports = () => {
        rudderstack.track({
            event: IQDATA_LIST_REPORTS,
            onTrack: (_data) => {
                const data = _data as unknown as CreatorReportsMetadata;
                if (!data.results) return false;
                if (Array.isArray(data.results) && data.results.length <= 0) return false;

                return {
                    platform,
                    influencer_id: creator_id,
                    report_id: data.results[0].id,
                };
            },
        });
    };

    const trackFetchReportOnFile = () => {
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
    };

    const trackFetchNewReport = () => {
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
    };

    const { error: recordError } = await recordReportUsage(company_id, user_id, creator_id);
    if (recordError) {
        serverLogger(recordError, 'error');
        return res.status(httpCodes.BAD_REQUEST).json({ error: recordError });
    }

    let report_id = '';
    let createdAt = '';

    trackListReports();
    const [err, reportMetadata] = await awaitToError<Error, CreatorReportsMetadata>(
        fetchReportsMetadata({ req, res, metadata: { pageUrl } })(platform, creator_id),
    );

    if (err) {
        serverLogger(err, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'cannot_process_report' });
    }

    report_id = reportMetadata?.results[0]?.id ?? '';
    createdAt = reportMetadata?.results[0]?.created_at ?? '';

    let data: CreatorReport | null = null;

    try {
        if (report_id) {
            trackFetchReportOnFile();
            data = await fetchReport({ req, res, metadata: { pageUrl } })(report_id);
        } else {
            trackFetchNewReport();
            data = await requestNewReport({ req, res, metadata: { pageUrl } })(platform, creator_id);
        }
    } catch (error: any) {
        // catch the retry_later error from iqdata so front end can show a message, for other errors they will be caught by apiHandler
        if (error.message.includes('retry_later')) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'retry_later' });
        }
        if (error.message.includes('is removed')) {
            return res.status(httpCodes.NOT_FOUND).json({ message: 'account_removed' });
        }
        throw serverLogger(error);
    }

    if (!data?.success) throw new Error('Failed to find report');

    data = {
        ...data,
        user_profile: {
            ...data.user_profile,
            url: generateUrlIfTiktok(data.user_profile.url, data.user_profile.handle ?? data.user_profile.username),
        },
    };

    const { influencer, socialProfile } = await tryToSaveInfluencer(data);

    await trackAndSnap(track, req, res, events, data);

    return res.status(httpCodes.OK).json({
        ...data,
        createdAt,
        influencer,
        socialProfile: {
            ...socialProfile,
            url: generateUrlIfTiktok(socialProfile?.url, socialProfile?.username),
        },
    });
}

export default ApiHandlerWithContext({
    getHandler,
});
