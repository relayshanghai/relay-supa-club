import { useState, useEffect } from 'react';
import { nextFetch } from 'src/utils/fetcher';
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
