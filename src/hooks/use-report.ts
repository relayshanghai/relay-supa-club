import type { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorReport } from 'types';
import { useUser } from './use-user';

export const useReport = () => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [usageExceeded, setUsageExceeded] = useState(false);
    const [gettingReport, setGettingReport] = useState(false);
    const { t } = useTranslation();
    const { profile } = useUser();

    //The transform function is not used now, as the image proxy issue is handled directly where calls for the image.But this is left for future refactor. TODO:Ticket V2-181
    // const transformReport = (report: CreatorReport, platform: string) => {
    //     if (platform === 'youtube' || platform === 'tiktok') {
    //         return {
    //             ...report,
    //             user_profile: {
    //                 ...report.user_profile,
    //                 picture: imgProxy(report.user_profile.picture) as string,
    //             },
    //         };
    //     }
    //     return report;
    // };

    const getOrCreateReport = useCallback(
        async (platform: CreatorPlatform, creator_id: string) => {
            setLoading(true);
            if (!profile) return;
            try {
                setGettingReport(true);
                if (!profile?.company_id) throw new Error('No company id found');
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

                // const transformed = transformReport(report, platform);
                setReport(report);
                setReportCreatedAt(createdAt);
                setErrorMessage('');
            } catch (error: any) {
                clientLogger(error, 'error');
                if (hasCustomError(error, usageErrors)) {
                    setUsageExceeded(true);
                    setErrorMessage(t(error.message) || '');
                } else setErrorMessage(t('creators.failedToFetchReport') || '');
            } finally {
                setLoading(false);
                setGettingReport(false);
            }
        },
        [profile, t],
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
