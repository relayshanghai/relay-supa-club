import {
    nextFetchReport,
    nextFetchReportMetadata,
    nextFetchReportNew
} from 'pages/api/creators/report';
import { useState, useEffect } from 'react';
import { CreatorPlatform, CreatorReport } from 'types';

export const CreatorPage = ({
    user_id,
    platform
}: {
    user_id: string;
    platform: CreatorPlatform;
}) => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    useEffect(() => {
        const getOrCreateReport = async () => {
            try {
                const existingReportIdRes = await nextFetchReportMetadata(platform as any, user_id);
                if (!existingReportIdRes?.results) throw new Error('No reports found');
                const existingReportId = existingReportIdRes.results[0]?.id;
                if (!existingReportId) throw new Error('No report ID found');
                setReportCreatedAt(existingReportIdRes.results[0].created_at);
                const existingReport = await nextFetchReport(existingReportId);
                setReport(existingReport);
            } catch (error) {
                const generateReportResponse = await nextFetchReportNew(platform, user_id);
                if (!generateReportResponse.success) throw new Error('Failed to generate report');
                setReport(generateReportResponse);
            }
        };
        getOrCreateReport();
    }, [platform, user_id]);

    return (
        <div className="flex flex-col p-6">
            {!report ? (
                <p>Generating Report</p>
            ) : (
                <>
                    <p>{platform}</p>
                    <p>{user_id}</p>
                    <p> ages:</p>
                    <p>{report.audience_followers.data.audience_ages[0].code}</p>
                    <p>Created at</p>
                    <p>{reportCreatedAt}</p>
                </>
            )}
        </div>
    );
};
