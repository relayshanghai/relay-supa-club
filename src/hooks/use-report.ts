import type { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorReport } from 'types';
import { useUser } from './use-user';
import useSWR from 'swr';
import { useCompany } from './use-company';
import type { eventKeys } from 'src/utils/analytics/events';
import type { InfluencerRow, InfluencerSocialProfileRow } from 'src/utils/api/db';
import { useRouter } from 'next/router';
import { type Nullable } from 'types/nullable';

// reports that have `createdAt` older than 59 days are considered stale
export const reportIsStale = (createdAt: string) => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - createdAtDate.getTime();
    return diff > 59 * 24 * 60 * 60 * 1000;
};
export type UseReport = ({
    platform,
    creator_id,
}: {
    platform: CreatorPlatform;
    creator_id: string;
    track?: eventKeys;
    suppressFetch?: boolean;
}) => {
    loading: boolean;
    report?: CreatorReport;
    reportCreatedAt?: string;
    influencer?: InfluencerRow;
    socialProfile?: InfluencerSocialProfileRow;
    errorMessage: string;
    errorStatus: Nullable<string>;
    usageExceeded: boolean;
    refreshReport: () => Promise<CreatorsReportGetResponse | undefined>;
};

export const useReport: UseReport = ({ platform, creator_id, track, suppressFetch }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [errorStatus, setErrorStatus] = useState<Nullable<string>>(null);
    const [usageExceeded, setUsageExceeded] = useState(false);
    const { t } = useTranslation();
    const { profile } = useUser();
    const { company } = useCompany();
    const router = useRouter();
    const { data, isLoading, mutate } = useSWR(
        !suppressFetch && platform && creator_id && company?.id && profile?.id
            ? ['creators/report', platform, creator_id, company?.id, profile?.id, router.pathname]
            : null,
        async ([path, platform, creator_id, company_id, user_id, pageUrl]) => {
            try {
                const { createdAt, influencer, socialProfile, ...report } = await nextFetchWithQueries<
                    CreatorsReportGetQueries,
                    CreatorsReportGetResponse
                >(path, {
                    platform,
                    creator_id,
                    company_id,
                    user_id,
                    track,
                    pageUrl,
                });

                /**
                 * THIS ERROR SHOULDN'T BE HERE BUT IT IS
                 *
                 * normally this error will be handled on catch block
                 * but the response status keeps returning 200
                 * so the error is being handled here
                 *
                 * so far it only happened to custom error: 'usage_exceeded'
                 */
                const weirdError = (report as any).error;
                if (hasCustomError({ message: weirdError }, usageErrors)) {
                    setErrorStatus(weirdError);
                    setUsageExceeded(true);
                    setErrorMessage(t(weirdError) || '');
                    return;
                }
                setErrorMessage('');
                setErrorStatus(null);
                return { createdAt, report, influencer, socialProfile };
            } catch (error: any) {
                clientLogger(error, 'error');
                const isRetryError = error.message.includes('retry_later');
                if (isRetryError) {
                    setErrorStatus('retry_later');
                    setErrorMessage(t('creators.retryLaterMessage') || '');
                } else if (hasCustomError(error, usageErrors)) {
                    setErrorStatus(error.message);
                    setUsageExceeded(true);
                    setErrorMessage(t(error.message) || '');
                } else {
                    setErrorStatus('server_busy');
                    setErrorMessage('server_busy');
                }
            }
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    );
    const { report, createdAt, influencer, socialProfile } = data || {};

    // mutate, refresh stale caches
    if (report && createdAt && reportIsStale(createdAt) && influencer) {
        mutate();
    }

    return {
        loading: isLoading,
        report,
        reportCreatedAt: createdAt,
        errorStatus,
        errorMessage,
        usageExceeded,
        influencer,
        socialProfile,
        refreshReport: mutate as unknown as () => Promise<CreatorsReportGetResponse | undefined>,
    };
};
