import { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useCallback, useState } from 'react';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import { CreatorPlatform, CreatorReport } from 'types';
import { useUser } from './use-user';

export const useReport = () => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState<boolean>(true);

    const { profile } = useUser();

    const getOrCreateReport = useCallback(
        async (platform: CreatorPlatform, creator_id: string) => {
            try {
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
                setLoading(false);
            } catch (error: any) {
                clientLogger(error, 'error');
                setErrorMessage(error?.message || 'Failed fetching report');
                setLoading(false);
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
    };
};
