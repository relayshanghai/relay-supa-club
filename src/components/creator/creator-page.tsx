import { useState, useEffect, useCallback } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { CreatorPlatform, CreatorReport } from 'types';
import { TitleSection } from './creator-title-section';
import { CreatorOverview } from './creator-page-overview';
import Head from 'next/head';
import { MetricsSection } from './creator-metrics-section';
import { PopularPostsSection } from './creator-popular-posts';
import CreatorSkeleton from './creator-skeleton';
import { useUser } from 'src/hooks/use-user';

export const CreatorPage = ({
    creator_id,
    platform,
}: {
    creator_id: string;
    platform: CreatorPlatform;
}) => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(
        !creator_id || !platform ? 'Invalid creator URL' : '',
    );
    const { profile } = useUser();

    const getOrCreateReport = useCallback(async () => {
        try {
            const { createdAt, ...report } = await nextFetch<CreatorReport & { createdAt: string }>(
                `creators/report?platform=${platform}&creator_id=${creator_id}&company_id=${profile?.company_id}&user_id=${profile?.id}`,
            );
            if (!report.success) throw new Error('Failed to fetch report');
            setReport(report);
            setReportCreatedAt(createdAt);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setErrorMessage(error.message);
        }
    }, [platform, creator_id, profile]);

    useEffect(() => {
        if (creator_id && platform && profile?.id) getOrCreateReport();
    }, [getOrCreateReport, platform, creator_id, profile?.id]);

    const onAddToCampaign = () => {
        //TODO: Add to campaign
    };
    return (
        <div>
            <Head>
                <title>{report?.user_profile.fullname || 'relay.club'}</title>
            </Head>
            <div className="flex flex-col">
                {!report || loading || errorMessage.length > 0 ? (
                    <CreatorSkeleton error={errorMessage.length > 0} errorMessage={errorMessage} />
                ) : (
                    <>
                        <TitleSection
                            user_profile={report.user_profile}
                            platform={platform}
                            onAddToCampaign={onAddToCampaign}
                            reportCreatedAt={reportCreatedAt}
                        />
                        <CreatorOverview report={report} />
                        <MetricsSection report={report} />
                        <PopularPostsSection report={report} />
                    </>
                )}
            </div>
        </div>
    );
};
