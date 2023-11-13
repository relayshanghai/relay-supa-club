import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { evaluateStat, processedAudienceDemoData } from 'src/utils/api/boostbot/helper';
import { calculateIndexScore } from './table/boostbot-score-cell';
import { useBoostbot } from 'src/hooks/use-boostbot';
import type { GetTopicsAndRelevanceResponse } from 'pages/api/boostbot/get-topics-and-relevance';

type InfluencerDetailsModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedRow?: Row<BoostbotInfluencer>;
};

export const InfluencerDetailsModal = ({ isOpen, setIsOpen, selectedRow }: InfluencerDetailsModalProps) => {
    const { t, i18n } = useTranslation();
    const { track } = useRudderstackTrack();
    const [areTopicsAndRelevanceLoading, setAreTopicsAndRelevanceLoading] = useState(true);
    const { getTopicsAndRelevance } = useBoostbot({});
    const [topicsAndRelevance, setTopicsAndRelevance] = useState<GetTopicsAndRelevanceResponse>([]);
    const translatedTopicsAndRelevance = areTopicsAndRelevanceLoading
        ? Array(7).fill({ topic: '-', relevance: 0.5 })
        : topicsAndRelevance.map((topic) => ({
              ...topic,
              topic: i18n.language === 'en-US' ? topic.topic_en : topic.topic_zh,
          }));

    useEffect(() => {
        const handleTopicsAndRelevance = async (topics: string[]) => {
            const topicsAndRelevance = await getTopicsAndRelevance(topics);

            setAreTopicsAndRelevanceLoading(false);
            setTopicsAndRelevance(topicsAndRelevance);
        };

        if (selectedRow && isOpen) {
            handleTopicsAndRelevance(selectedRow.original.topics);
        }
    }, [getTopicsAndRelevance, selectedRow, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setAreTopicsAndRelevanceLoading(true);
            setTopicsAndRelevance([]);
        }
    }, [isOpen]);

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
        avg_reels_plays: avgReelsPlaysRaw, // this is avg views for instagram
        engagement_rate: engagementRateRaw,
        posts_count: totalPosts,
        followers,
        followers_growth: followersGrowthRaw,
        url,
        user_id,
    } = influencer;

    // @note get platform from url for now
    //       `influencer` was supposed to be `UserProfile` type which contains `type` for platform but it's not there on runtime
    const platform = url.includes('youtube') ? 'youtube' : url.includes('tiktok') ? 'tiktok' : 'instagram';
    const indexScore = calculateIndexScore(influencer);

    // convert raw decimal numbers to string percentage
    const engagementRate = `${Math.round(engagementRateRaw * 100)}%`;
    const avgViews = numberFormatter(avgViewsRaw, 0) || numberFormatter(avgReelsPlaysRaw, 0);
    const followersGrowth = `${Math.round((followersGrowthRaw ?? 0) * 100)}%`;

    // engaged audience = (avg views / followers) * 100
    const engagedAudience = `${Math.round(((avgViewsRaw ?? avgReelsPlaysRaw ?? 0) / followers) * 100)}%`;

    const handleAddToSequence = () => {
        setIsOpen(false);
        // TODO: add to sequence function in V2-1029
    };

    // Used to break multiline labels into multiple tspans to prevent text overflow
    function CustomizedTick({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
        return (
            <text x={x} y={y} dy={-4} fill="black" fontSize={10} textAnchor="middle">
                {payload.value.split(' ').map((word: string, index: number) => (
                    <tspan key={index} x={x} dy={index ? '1.2em' : 0}>
                        {word}
                    </tspan>
                ))}
            </text>
        );
    }

    const processedDemoData = processedAudienceDemoData(influencer);
    return (
        <Modal
            maxWidth="max-w-3xl"
            visible={isOpen}
            onClose={() => setIsOpen(false)}
            data-testid="boostbot-influencer-detail-modal"
        >
            <div className="flex flex-col items-center justify-center">
                {/* influencers thumbnail and info */}
                <div className="flex w-full justify-between">
                    <div className="mb-5 flex gap-3">
                        <div className="h-16 w-16 align-middle">
                            <img
                                className="h-full w-full rounded-full border border-gray-200 bg-gray-100 object-cover"
                                src={picture}
                                alt={handle ?? username}
                            />
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-gray-700">{fullname}</div>

                            <div className="flex">
                                <div className="text-sm text-primary-500 ">@</div>
                                <span className="text-sm text-gray-600">{handle ?? username}</span>
                            </div>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-primary-50 bg-primary-100 font-semibold text-primary-600">
                            <div>{indexScore}</div>
                        </div>
                    </div>
                    <Link
                        href={`/influencer/${encodeURIComponent(platform)}/${encodeURIComponent(user_id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 outline-none hover:cursor-pointer hover:text-primary-500"
                        onClick={() =>
                            track(OpenAnalyzeProfile, { currentPage: CurrentPageEvent.boostbot, platform, user_id })
                        }
                        data-testid="boostbot-modal-open-report-link"
                    >
                        {t('boostbot.modal.unlockDetailedReport')}
                    </Link>
                </div>

                {/* stats - top niches and audience engagement */}
                <div className="mb-6 flex w-full gap-6">
                    <div className="w-1/2 px-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            {t('boostbot.modal.topNiches')}
                        </div>
                        <div className={`w-full ${areTopicsAndRelevanceLoading ? 'animate-pulse' : ''}`}>
                            <ResponsiveContainer width={320} height={280}>
                                <RadarChart outerRadius={90} cx="50%" cy="50%" data={translatedTopicsAndRelevance}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="topic" tick={CustomizedTick} />
                                    <PolarRadiusAxis tick={false} axisLine={false} />
                                    <Radar
                                        name="top_niches"
                                        dataKey="relevance"
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
                            {t('boostbot.modal.audienceEngagementStats')}
                        </div>
                        <StatCard title={t('boostbot.modal.engagedAudience')} stat={engagedAudience} />
                        <div className="grid grid-cols-2 space-x-3">
                            <StatCard
                                title={t('boostbot.modal.engagementRate')}
                                stat={engagementRate}
                                iconName={evaluateStat({ engagementRateRaw })}
                            />
                            {avgViewsRaw && (
                                <StatCard
                                    title={t('boostbot.modal.averageViews')}
                                    stat={avgViews ?? '-'}
                                    iconName={evaluateStat({ avgViewsRaw })}
                                />
                            )}
                            {avgReelsPlaysRaw && (
                                <StatCard
                                    title={t('boostbot.modal.averageViews')}
                                    stat={avgViews ?? '-'}
                                    iconName={evaluateStat({ avgReelsPlaysRaw })}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* stats - audience gender and channel stats */}
                <div className="flex w-full gap-6">
                    <div className="w-1/2 px-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            {t('boostbot.modal.audienceGender')}
                        </div>

                        <ResponsiveContainer width={320} height={140}>
                            <BarChart
                                data={processedDemoData}
                                margin={{
                                    top: 32,
                                    right: 16,
                                }}
                            >
                                <CartesianGrid vertical={false} horizontal={false} />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis width={16} tick={false} axisLine={false} />
                                <Bar dataKey="female" fill="#fcceee" radius={2} />
                                <Bar dataKey="male" fill="#b8ccff" radius={2} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            {t('boostbot.modal.channelStats')}
                        </div>
                        <div className="grid grid-cols-2 space-x-3">
                            {followersGrowthRaw !== undefined && (
                                <StatCard
                                    title={t('boostbot.modal.followersGrowth')}
                                    stat={followersGrowth.toString()}
                                    iconName={evaluateStat({ followersGrowthRaw })}
                                />
                            )}
                            {totalPosts && (
                                <StatCard
                                    title={t('boostbot.modal.totalPosts')}
                                    stat={totalPosts.toString()}
                                    iconName={evaluateStat({ totalPosts })}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* button */}
                <div className="mt-8 box-border flex w-full justify-end font-semibold">
                    <Button className="boostbot-gradient rounded-lg border-none px-4" onClick={handleAddToSequence}>
                        {t('boostbot.modal.addToSequence')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
