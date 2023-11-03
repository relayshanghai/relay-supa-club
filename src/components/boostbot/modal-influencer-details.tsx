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
import Link from 'next/link';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenAnalyzeProfile } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';

type InfluencerDetailsModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedRow?: Row<BoostbotInfluencer>;
};

export const InfluencerDetailsModal = ({ isOpen, setIsOpen, selectedRow }: InfluencerDetailsModalProps) => {
    // const { t } = useTranslation();
    const { track } = useRudderstackTrack();

    if (!selectedRow) {
        return null;
    }

    const influencer = selectedRow && selectedRow.original;
    const {
        fullname,
        picture,
        handle,
        username, // this is handle for instagram and tiktok
        avg_views: avgViewsRaw,
        avg_reels_plays: avgReelsPlays, // this is avg views for instagram
        engagement_rate: engagementRateDecimal,
        posts_count: totalPosts,
        followers,
        followers_growth: followersGrowthRaw,
        url,
        user_id,
    } = influencer;
    // @note get platform from url for now
    //       `influencer` was supposed to be `UserProfile` type which contains `type` for platform but it's not there on runtime
    const platform = url.includes('youtube') ? 'youtube' : url.includes('tiktok') ? 'tiktok' : 'instagram';

    const engagementRatePercentage = `${Math.round(engagementRateDecimal * 100)}%`;
    const avgViews = numberFormatter(avgViewsRaw, 0) || numberFormatter(avgReelsPlays, 0);
    //engagement rate = (avg views / followers) * 100
    const engagedAudience = `${Math.round(((avgViewsRaw ?? avgReelsPlays ?? 0) / followers) * 100)}%`;
    const followersGrowth = `${Math.round((followersGrowthRaw ?? 0) * 100)}%`;

    const handleAddToSequence = () => {
        setIsOpen(false);
        //TODO: add to sequence function in V2-1029
    };

    // TODO: replace placeholder in V2-1018
    const dummyRadarGraphData = [
        { subject: 'Productivity', A: 90, fullMark: 150 },
        { subject: 'Fitness Routine', A: 60, fullMark: 150 },
        { subject: 'Sports', A: 88, fullMark: 150 },
        { subject: 'Theraputics', A: 66, fullMark: 150 },
        { subject: 'Yoga', A: 80, fullMark: 150 },
        { subject: 'Wellness', A: 90, fullMark: 150 },
        { subject: 'Injury Recovery', A: 23, fullMark: 150 },
    ];

    // TODO: replace placeholder in V2-1075
    const dummyBarChartData = [
        {
            name: '13-17',
            male: 4000,
            female: 2400,
        },
        {
            name: '18-24',
            male: 3000,
            female: 1398,
        },
        {
            name: '25-40',
            male: 2000,
            female: 1800,
        },
        {
            name: '40-65',
            male: 2780,
            female: 2908,
        },
        {
            name: '65+',
            male: 1890,
            female: 3800,
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
                                alt={handle ?? username}
                            />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-gray-700">{fullname}</div>

                            <div className="flex">
                                <div className="text-sm text-primary-500 ">@</div>
                                <span className="text-sm text-gray-600">{handle ?? username}</span>
                            </div>
                        </div>
                        {/* TODO: connect with the score formulation in V2-1063  */}
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-primary-50 bg-primary-100 font-semibold text-primary-600">
                            <div>86</div>
                        </div>
                    </div>
                    <Link
                        href={`/influencer/${encodeURIComponent(platform)}/${encodeURIComponent(user_id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gray-400 outline-none hover:cursor-pointer hover:text-primary-500"
                        onClick={() =>
                            track(OpenAnalyzeProfile, { currentPage: CurrentPageEvent.boostbot, platform, user_id })
                        }
                        data-testid="boostbot-modal-open-report-link"
                    >
                        Unlock Detailed Analysis Report
                    </Link>
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
                            <StatCard title="Average Views" stat={avgViews ?? '-'} iconColor="green" />
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
                                <Bar dataKey="female" fill="#fcceee" />
                                <Bar dataKey="male" fill="#b2ccff" />
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
                    <Button className="boostbot-gradient w-1/2 border-none" onClick={handleAddToSequence}>
                        Add to Sequence
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
