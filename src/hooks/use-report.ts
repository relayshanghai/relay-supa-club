import { useCallback, useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { CreatorReport } from 'types';
import { useUser } from './use-user';

export const useReport = () => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { profile } = useUser();

    const getOrCreateReport = useCallback(
        async (platform: string, creator_id: string) => {
            try {
                const { createdAt, ...report } = await nextFetch<
                    CreatorReport & { createdAt: string }
                >(
                    `creators/report?platform=${platform}&creator_id=${creator_id}&company_id=${profile?.company_id}&user_id=${profile?.id}`
                );
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
