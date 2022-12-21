import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Layout } from 'src/modules/layout';
import { fetchReport, fetchReportsMetadata } from 'src/utils/api/iqdata';
import { CreatorReport } from 'types';

const Page = () => {
    const [report, setReport] = useState<CreatorReport | null>(null);
    const [reportCreatedAt, setReportCreatedAt] = useState<string | null>(null);
    useEffect(() => {
        const getExistingReport = async () => {
            const existingReportIdRes = await fetchReportsMetadata(platform as any, user_id);
            if (existingReportIdRes?.results) {
                const existingReportId = existingReportIdRes.results[0]?.id;
                if (existingReportId) {
                    setReportCreatedAt(existingReportIdRes.results[0].created_at);
                    const existingReport = await fetchReport(existingReportId);
                    setReport(existingReport);
                }
                // setReport(existingReportId);
            }
        };
        getExistingReport();
    });

    const { ids } = useRouter().query;
    if (!ids || typeof ids !== 'object') return null;
    const [platform, user_id] = ids as string[];

    if (!report) return null;

    return (
        <Layout>
            <div className="flex flex-col p-6">
                <p>{platform}</p>
                <p>{user_id}</p>
                <p> ages:</p>
                <p>{report.audience_followers.data.audience_ages[0].code}</p>
                <p>Created at</p>
                <p>{reportCreatedAt}</p>
                {/* <p>{creator?.user_profile.username}</p>
                <p>{error}</p> */}
            </div>
        </Layout>
    );
};

export default Page;
