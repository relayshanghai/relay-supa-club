import { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useCallback, useState } from 'react';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { CreatorPlatform, CreatorReport } from 'types';
import { useUser } from './use-user';

export const useReport = () => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
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
                    user_id: profile?.id
                });
                if (!report.success) throw new Error('Failed to fetch report');
                setReport(report);
                setReportCreatedAt(createdAt);
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        },
        [profile]
    );

    return {
        getOrCreateReport,
        report,
        reportCreatedAt,
        errorMessage
    };
};
