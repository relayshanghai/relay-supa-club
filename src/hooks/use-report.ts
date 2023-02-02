import { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useCallback, useState } from 'react';
import { usageError } from 'src/utils/api/db';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import { CreatorPlatform, CreatorReport } from 'types';
import { useUser } from './use-user';

export const useReport = () => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [usageExceeded, setUsageExceeded] = useState(false);
    const [gettingReport, setGettingReport] = useState(false);

    const { profile } = useUser();

    const getOrCreateReport = useCallback(
        async (platform: CreatorPlatform, creator_id: string) => {
            try {
                setGettingReport(true);
                if (!profile?.company_id) throw new Error('User not logged in');
                const { createdAt, ...report } = await nextFetchWithQueries<
                    CreatorsReportGetQueries,
                    CreatorsReportGetResponse
                >('creators/report', {
                    platform,
                    creator_id,
                    company_id: profile?.company_id,
                    user_id: profile?.id,
                });
                if (!report.success) throw new Error('Failed to fetch report');
                setReport(report);
                setReportCreatedAt(createdAt);
            } catch (error: any) {
                clientLogger(error, 'error');
                if (error.message && Object.values(usageError).includes(error.message)) {
                    setUsageExceeded(true);
                    setErrorMessage(error.message);
                } else setErrorMessage('Failed fetching report');
            } finally {
                setLoading(false);
                setGettingReport(false);
            }
        },
        [profile],
    );

    return {
        loading,
        getOrCreateReport,
        report,
        reportCreatedAt,
        errorMessage,
        usageExceeded,
        gettingReport,
    };
};
