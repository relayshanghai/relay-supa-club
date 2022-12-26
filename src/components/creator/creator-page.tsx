import Head from 'next/head';
import { useState, useEffect } from 'react';

import {
    nextFetchReport,
    nextFetchReportMetadata,
    nextFetchReportNew
} from 'pages/api/creators/report';
import { CreatorPlatform, CreatorReport } from 'types';
import { TitleSection } from './creator-title-section';
import { CreatorOverview } from './creator-page-overview';

export const CreatorPage = ({
    user_id,
    platform
}: {
    user_id: string;
    platform: CreatorPlatform;
}) => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    //    TODO: translations and loader compontent
    const [loadingMessage, setLoadingMessage] = useState<string | null>('Checking for report...');
    useEffect(() => {
        const getOrCreateReport = async () => {
            try {
                const existingReportIdRes = await nextFetchReportMetadata(platform, user_id);
                if (!existingReportIdRes?.results) throw new Error('No reports found');
                const existingReportId = existingReportIdRes.results[0]?.id;
                if (!existingReportId) throw new Error('No report ID found');
                setReportCreatedAt(existingReportIdRes.results[0].created_at);
                setLoadingMessage('Loading report...');
                const existingReport = await nextFetchReport(existingReportId);
                setReport(existingReport);
                setLoadingMessage(null);
            } catch (error) {
                setLoadingMessage('Generating report...');
                const generateReportResponse = await nextFetchReportNew(platform, user_id);
                if (!generateReportResponse.success) throw new Error('Failed to generate report');
                setReport(generateReportResponse);
                setLoadingMessage(null);
            }
        };
        getOrCreateReport();
    }, [platform, user_id]);

    const onAddToCampaign = () => {
        //TODO: Add to campaign
    };

    return (
        <div>
            <Head>
                <title>{report?.user_profile.fullname || 'relay.club'}</title>
            </Head>
            <div className="flex flex-col p-6">
                {!report ? (
                    <p>{loadingMessage}</p>
                ) : (
                    <>
                        <TitleSection
                            user_profile={report.user_profile}
                            platform={platform}
                            onAddToCampaign={onAddToCampaign}
                            reportCreatedAt={reportCreatedAt}
                        />
                        <CreatorOverview report={report} />
                    </>
                )}
            </div>
        </div>
    );
};
