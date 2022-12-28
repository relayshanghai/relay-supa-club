import { useState, useEffect } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { CreatorPlatform, CreatorReport } from 'types';
import { TitleSection } from './creator-title-section';
import { CreatorOverview } from './creator-page-overview';
import Head from 'next/head';

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
    useEffect(() => {
        const getOrCreateReport = async () => {
            try {
                const { createdAt, ...report } = await nextFetch<
                    CreatorReport & { createdAt: string }
                >(`creators/report?platform=${platform}&user_id=${user_id}`);
                setReport(report);
                setReportCreatedAt(createdAt);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
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
            <div className="flex flex-col">
                {!report ? (
                    <p>Loading report...</p>
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
