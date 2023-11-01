// import { useTranslation } from 'react-i18next';
import { Modal } from 'src/components/modal';
import { Button } from 'src/components/button';
import {
    Bar,
    BarChart,
    CartesianGrid,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import StatCard from './stat-card';
import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { numberFormatter } from 'src/utils/formatter';

type InfluencerDetailsModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedRow?: Row<BoostbotInfluencer>;
};

export const InfluencerDetailsModal = ({ isOpen, setIsOpen, selectedRow }: InfluencerDetailsModalProps) => {
    // const { t } = useTranslation();
    if (!selectedRow) {
        return null;
    }

    const influencer = selectedRow && selectedRow.original;

    const {
        fullname,
        picture,
        handle,
        avg_views: avgViewsRaw,
        engagement_rate: engagementRateDecimal,
        posts_count: totalPosts,
        followers,
        followers_growth: followersGrowth,
    } = influencer;

    const engagementRatePercentage = `${Math.round(engagementRateDecimal * 100)}%`;
    const avgViews = numberFormatter(avgViewsRaw, 0);
    //engagement rate = (avg views / followers) * 100
    const engagedAudience = `${Math.round(((avgViewsRaw ? avgViewsRaw : 0) / followers) * 100)}%`;

    // TODO: replace with real data
    const dummyRadarGraphData = [
        { subject: 'Productivity', A: 90, fullMark: 150 },
        { subject: 'Fitness Routine', A: 60, fullMark: 150 },
        { subject: 'Sports', A: 88, fullMark: 150 },
        { subject: 'Theraputics', A: 66, fullMark: 150 },
        { subject: 'Yoga', A: 80, fullMark: 150 },
        { subject: 'Wellness', A: 90, fullMark: 150 },
        { subject: 'Injury Recovery', A: 23, fullMark: 150 },
    ];

    // TODO: replace with real data
    const dummyBarChartData = [
        {
            name: '13-17',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: '18-24',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: '25-40',
            uv: 2000,
            pv: 1800,
            amt: 2290,
        },
        {
            name: '40-65',
            uv: 2780,
            pv: 2908,
            amt: 2000,
        },
        {
            name: '65+',
            uv: 1890,
            pv: 3800,
            amt: 2181,
        },
    ];

    return (
        <Modal maxWidth="max-w-3xl" visible={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col items-center justify-center">
                {/* influencers thumbnail and info */}
                <div className="flex w-full justify-between">
                    <div className="mb-5 flex gap-3">
                        {/* TODO: make the influencer thumbnail reusable component */}
                        <div className="h-16 w-16 align-middle">
                            <img
                                className="h-full w-full rounded-full border border-gray-200 bg-gray-100 object-cover"
                                src={picture}
                                alt={handle}
                            />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-gray-700">{fullname}</div>
                            {handle && (
                                <div className="flex">
                                    <div className="text-sm text-primary-500 ">@</div>
                                    <span className="text-sm text-gray-600">{handle}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-primary-50 bg-primary-100 font-semibold text-primary-600">
                            <div>86</div>
                        </div>
                    </div>

                    <div className="text-xs font-semibold text-gray-400 hover:cursor-pointer hover:text-primary-500">
                        Unlock Detailed Analysis Report
                    </div>
                </div>

                {/* stats - top niches and audience engagement */}
                <div className="mb-6 flex w-full gap-6">
                    <div className="w-1/2 px-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">Top Niches</div>
                        <div className="w-full">
                            <ResponsiveContainer width={320} height={280}>
                                <RadarChart outerRadius={90} cx="50%" cy="50%" data={dummyRadarGraphData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                                    <PolarRadiusAxis tick={false} axisLine={false} />
                                    <Radar
                                        name="top_niches"
                                        dataKey="A"
                                        strokeWidth={2}
                                        stroke="#7C3AED" //text-primary-600
                                        fill="#DDD6FE" //text-primary-200
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="w-1/2 space-y-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            Audience Engagement Stats
                        </div>
                        <StatCard title="Engaged Audience" stat={engagedAudience} iconColor="yellow" />
                        <div className="grid grid-cols-2 space-x-3">
                            <StatCard title="Engagement Rate" stat={engagementRatePercentage} iconColor="green" />
                            <StatCard title="Average Views" stat={avgViews ? avgViews : '-'} iconColor="green" />
                        </div>
                    </div>
                </div>

                {/* stats - audience gender and channel stats */}
                <div className="flex w-full gap-6">
                    <div className="w-1/2 px-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            Audience Gender
                        </div>

                        <ResponsiveContainer width={320} height={140}>
                            <BarChart
                                data={dummyBarChartData}
                                margin={{
                                    top: 48,
                                    right: 48,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid vertical={false} horizontal={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis tick={false} axisLine={false} />
                                <Bar dataKey="pv" fill="#b2ccff" />
                                <Bar dataKey="uv" fill="#fcceee" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            Channel Stats
                        </div>
                        <div className="grid grid-cols-2 space-x-3">
                            <StatCard
                                title="Followers Growth"
                                stat={followersGrowth ? followersGrowth.toString() : '-'}
                                iconColor="green"
                            />
                            <StatCard
                                title="Total Posts"
                                stat={totalPosts ? totalPosts.toString() : '-'}
                                iconColor="green"
                            />
                        </div>
                    </div>
                </div>

                {/* buttons */}
                <div className="mt-8 box-border flex w-full justify-center space-x-3 px-6 font-semibold">
                    <Button variant="gray" className="w-1/2" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="boostbot-gradient w-1/2 border-none">Add to Sequence</Button>
                </div>
            </div>
        </Modal>
    );
};
