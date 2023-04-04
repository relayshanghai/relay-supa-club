import type {
    CreatorsReportGetQueries,
    CreatorsReportGetResponse,
} from 'pages/api/creators/report';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorReport } from 'types';
import { useUser } from './use-user';

export interface ReportsContext {
    reports: CreatorReport[];
    /** the id of a currently loading report */
    useReport: ({ platform, creator_id }: { platform: CreatorPlatform; creator_id: string }) => {
        loading: boolean;
        getOrCreateReport: () => Promise<ReportWithCreatedAt | undefined>;
        report: ReportWithCreatedAt | undefined;
        reportCreatedAt: string | undefined;
        errorMessage: string;
        usageExceeded: boolean;
        gettingReport: boolean;
    };
}

export const reportsContext = createContext<ReportsContext>({
    reports: [],
    useReport: () => ({
        loading: false,
        getOrCreateReport: async () => undefined,
        report: undefined,
        reportCreatedAt: undefined,
        errorMessage: '',
        usageExceeded: false,
        gettingReport: false,
    }),
});

export interface ReportWithCreatedAt extends CreatorReport {
    createdAt: string;
}

export const ReportsProvider = ({ children }: PropsWithChildren) => {
    const [reports, setReports] = useState<ReportWithCreatedAt[]>([]);

    const useReportInternal = ({
        reports,
        setReports,
        platform,
        creator_id,
    }: {
        platform: CreatorPlatform;
        creator_id: string;
        reports: ReportWithCreatedAt[];
        setReports: Dispatch<SetStateAction<ReportWithCreatedAt[]>>;
    }) => {
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

        const reportAlreadyExists = useCallback(
            (platform: CreatorPlatform, creator_id: string) => {
                return reports.find(
                    (report) =>
                        report.user_profile.type === platform &&
                        report.user_profile.user_id === creator_id,
                );
            },
            [reports],
        );

        const getOrCreateReport = useCallback(async () => {
            try {
                setLoading(true);
                const existing = reportAlreadyExists(platform, creator_id);
                if (existing) {
                    setLoading(false);
                    return existing;
                }
                if (!profile) throw new Error('No profile found');
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
                setReports((reports) => reports.concat({ ...report, createdAt }));
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
        }, [creator_id, platform, profile, reportAlreadyExists, setReports, t]);

        const report = reports.find(
            (report) =>
                report.user_profile.type === platform && report.user_profile.user_id === creator_id,
        );

        return {
            loading,
            getOrCreateReport,
            report,
            reportCreatedAt: report?.createdAt,
            errorMessage,
            usageExceeded,
            gettingReport,
        };
    };
    const useReport = ({
        platform,
        creator_id,
    }: {
        platform: CreatorPlatform;
        creator_id: string;
    }) => {
        return useReportInternal({ reports, setReports, platform, creator_id });
    };

    return (
        <reportsContext.Provider value={{ reports, useReport }}>{children}</reportsContext.Provider>
    );
};
