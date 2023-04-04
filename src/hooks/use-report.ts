import type { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform } from 'types';
import { useUser } from './use-user';
import useSWR from 'swr';

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

export const useReport = ({ platform, creator_id }: { platform: CreatorPlatform; creator_id: string }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [usageExceeded, setUsageExceeded] = useState(false);
    const { t } = useTranslation();
    const { profile } = useUser();

    const { data, isLoading } = useSWR(
        platform && creator_id && profile?.company_id && profile?.id
            ? ['creators/report', platform, creator_id, profile?.company_id, profile?.id]
            : null,
        async ([path, platform, creator_id, company_id, user_id]) => {
            try {
                const { createdAt, ...report } = await nextFetchWithQueries<
                    CreatorsReportGetQueries,
                    CreatorsReportGetResponse
                >(path, {
                    platform,
                    creator_id,
                    company_id,
                    user_id,
                });

                if (!report.success) throw new Error('Failed to fetch report');
                // const transformed = transformReport(report, platform);
                setErrorMessage('');
                return { createdAt, report };
            } catch (error: any) {
                clientLogger(error, 'error');
                if (hasCustomError(error, usageErrors)) {
                    setUsageExceeded(true);
                    setErrorMessage(t(error.message) || '');
                } else setErrorMessage(t('creators.failedToFetchReport') || '');
            }
        },
    );
    const { report, createdAt } = data || {};

    return {
        loading: isLoading,
        report,
        reportCreatedAt: createdAt,
        errorMessage,
        usageExceeded,
    };
};
