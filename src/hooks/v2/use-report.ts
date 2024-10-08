import type { CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useTranslation } from 'react-i18next';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorReport } from 'types';
import { useUser } from '../use-user';
import useSWR from 'swr';
import { useCompany } from '../use-company';
import type { InfluencerRow, InfluencerSocialProfileRow } from 'src/utils/api/db';
import { useRouter } from 'next/router';
import { type Nullable } from 'types/nullable';
import { useReportStore } from 'src/store/reducers/report';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { AxiosError, type AxiosResponse } from 'axios';

// reports that have `createdAt` older than 59 days are considered stale
export const reportIsStale = (createdAt: string) => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - createdAtDate.getTime();
    return diff > 59 * 24 * 60 * 60 * 1000;
};
export type ReportV2 = ({
    platform,
    creator_id,
}: {
    platform: CreatorPlatform;
    creator_id: string;
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

export const useReportV2: ReportV2 = ({ platform, creator_id, suppressFetch }) => {
    const { errorMessage, errorStatus, usageExceeded, setErrorMessage, setErrorStatus, setUsageExceeded } =
        useReportStore();
    const { t } = useTranslation();
    const { profile } = useUser();
    const { company } = useCompany();
    const { apiClient } = useApiClient();
    const router = useRouter();
    const { data, isLoading, mutate } = useSWR(
        !suppressFetch && platform && creator_id && company?.id && profile?.id
            ? ['creators/report', platform, creator_id, company?.id, profile?.id, router.pathname]
            : null,
        async ([, platform, creator_id, company_id, user_id]) => {
            const queries = {
                platform,
                creator_id,
                company_id,
                user_id,
            };
            try {
                const [err, res] = await awaitToError<AxiosError, AxiosResponse<CreatorsReportGetResponse>>(
                    apiClient.get(`/creators/report?${new URLSearchParams(queries).toString()}`),
                );
                if (err) {
                    throw err;
                }
                const { data } = res;
                const { createdAt, influencer, socialProfile, ...report } = data ?? {};

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
                } else if (!report.user_profile) {
                    setErrorMessage('retry_later');
                    return;
                }
                setErrorMessage('');
                setErrorStatus(null);
                return { createdAt, report, influencer, socialProfile };
            } catch (err: any) {
                const error: { message: string } | null = { message: '' };
                if (err instanceof AxiosError) {
                    error.message = err.response?.data.error || err.response?.data.message || err.message;
                }
                clientLogger(error, 'error');
                if (error.message.includes('retry_later')) {
                    setErrorStatus('retry_later');
                    setErrorMessage(t('creators.retryLaterMessage') || '');
                } else if (error.message.includes('account_removed')) {
                    setErrorStatus('account_removed');
                    setErrorMessage(t('sequences.account_removed'));
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
