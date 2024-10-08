import { Modal } from 'app/components/modals';
import type { InfluencerSocialProfileEntity } from 'src/backend/database/influencer/influencer-social-profile-entity';
import { AvatarWithFallback } from '../avatar/avatar-with-fallback';
import { calculateIndexScore, processedAudienceData } from 'app/utils/index-score';
import { Tooltip } from 'src/components/library';
import { Question, Spinner } from 'app/components/icons';
import { useTranslation } from 'react-i18next';
import { useRelevantTopics } from 'src/hooks/v2/use-influencer';
import { enUS } from 'src/constants';
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
import CustomTick from './custom-tick';
import Link from 'next/link';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import StatCard from 'src/components/boostbot/stat-card';
import { evaluateStat } from 'src/utils/api/boostbot/helper';
const emptyStateChartData = [
    {
        subject: '',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: '',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: '',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: '',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: '',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: '',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: '',
        A: 0,
        B: 0,
        fullMark: 150,
    },
];
export interface ReportModalProps {
    influencerSocialProfiles: InfluencerSocialProfileEntity;
    open: boolean;
    onClose: () => void;
}
export default function ReportModal({ influencerSocialProfiles, open, onClose }: ReportModalProps) {
    const score = calculateIndexScore(influencerSocialProfiles);
    const processedData = processedAudienceData(influencerSocialProfiles);
    const {
        avg_views: avgViewsRaw,
        avg_reels_plays: avgReelsPlaysRaw, // this is avg views for instagram
        engagement_rate: engagementRateRaw,
        posts_count: totalPosts,
        followers: followersRaw,
        followers_growth: followersGrowthRaw,
        engagements,
    } = influencerSocialProfiles.data as any;
    const followers = numberFormatter(followersRaw, 0);
    const avgViews = numberFormatter(avgViewsRaw, 0) || numberFormatter(avgReelsPlaysRaw, 0);
    const followersGrowth = decimalToPercent(followersGrowthRaw, 0);
    // audience engagement rate for Youtube = (Engagements + Avg Views) / Followers see V2-1063
    const audienceEngagementRateYTInt = Number((engagements + (avgViewsRaw ?? 0)) / followersRaw);
    const audienceEngagementRateYT = decimalToPercent(audienceEngagementRateYTInt, 0);
    // audience engagement rate for Instagram and Tiktok is just engagmentRate see V2-1063
    const audienceEngagementRateIGandTT = decimalToPercent(engagementRateRaw, 0);
    const { t, i18n } = useTranslation();
    const { topics, loading } = useRelevantTopics(influencerSocialProfiles.platform, influencerSocialProfiles.username);
    const translatedTopics = topics.map((topic) => ({
        ...topic,
        topic: i18n.language === enUS ? topic.topicEn : topic.topicZh,
    }));
    const { user_id: userId } = influencerSocialProfiles.data as any;
    const platform = influencerSocialProfiles.platform;
    return (
        <Modal padding={0} visible={open} onClose={onClose}>
            <>
                <div className="inline-flex w-[800px] flex-col items-center justify-start rounded-xl bg-[#fefefe] shadow">
                    <div className="flex h-24 flex-col items-center justify-start self-stretch bg-gradient-to-tr from-[#52379e] to-[#6840c6]">
                        <div className="flex h-[84px] flex-col items-start justify-start gap-4 self-stretch px-6 pt-6">
                            <div className="inline-flex items-center justify-between self-stretch">
                                <div className="flex items-center justify-start gap-3">
                                    <div className="inline-flex flex-col items-start justify-start">
                                        <AvatarWithFallback
                                            url={influencerSocialProfiles.avatarUrl}
                                            name={influencerSocialProfiles.username}
                                        />
                                    </div>
                                    <div className="flex items-start justify-start gap-2.5 self-stretch">
                                        <div className="inline-flex h-9 w-9 flex-col items-center justify-center gap-2.5 rounded-[28px] border-4 border-green-100 bg-[#fefefe] px-[11px] py-2.5">
                                            <div className="h-[23px] w-[21px] text-center font-['Poppins'] text-sm font-bold leading-normal tracking-tight text-green-600">
                                                {score}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex flex-col items-center justify-end gap-1 self-stretch pr-3">
                                    <Link
                                        href={`/influencer/${encodeURIComponent(platform)}/${encodeURIComponent(
                                            userId,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-gray-400 outline-none hover:cursor-pointer hover:text-primary-500"
                                        data-testid="boostbot-modal-open-report-link"
                                        id="boostbot-influencer-detailed-report-link"
                                    >
                                        {t('boostbot.modal.unlockDetailedReport')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg p-2">
                            <div className="relative h-6 w-6" />
                        </div>
                        <div className="h-3 self-stretch" />
                    </div>
                    <div className="inline-flex items-start justify-start gap-6 self-stretch py-2.5 pl-2 pr-6">
                        <div className="inline-flex flex-col items-start justify-start gap-6">
                            <div className="flex flex-col items-start justify-start gap-1 rounded bg-[#fefefe] px-4">
                                <div className="flex h-8 flex-col items-start justify-start gap-1 self-stretch">
                                    <div className="flex flex-row border-b border-gray-200 text-base font-semibold text-gray-700">
                                        {t('boostbot.modal.topNiches')}
                                        <Tooltip
                                            content={t(`tooltips.boostBotNiches.title`)}
                                            detail={t(`tooltips.boostBotNiches.description`)}
                                            position="bottom-right"
                                            className="w-fit"
                                        >
                                            <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className="inline-flex items-center justify-center gap-4 bg-[#fefefe]">
                                    {topics.length === 0 && !loading ? (
                                        <div className="relative flex h-[280px] w-80 items-center justify-center">
                                            <p className="left-[42%] top-[45%] flex text-center text-lg font-semibold">
                                                {t('boostbot.modal.noNichesFound')}
                                            </p>
                                            <ResponsiveContainer className="absolute" width={320} height={280}>
                                                <RadarChart
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={90}
                                                    data={emptyStateChartData}
                                                >
                                                    <PolarGrid stroke="#c1c5cb" />
                                                    <PolarAngleAxis dataKey="subject" tick={CustomTick} />
                                                    <PolarRadiusAxis tick={false} axisLine={false} />
                                                    <Radar
                                                        name="Mike"
                                                        dataKey="A"
                                                        strokeWidth={2}
                                                        stroke="#8884d8"
                                                        fill="#8884d8"
                                                        fillOpacity={0.6}
                                                    />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : topics.length > 0 && !loading ? (
                                        <ResponsiveContainer width={320} height={280}>
                                            <RadarChart outerRadius={90} cx="50%" cy="50%" data={translatedTopics}>
                                                <PolarGrid stroke={loading ? '#c1c5cb' : '#e5e7eb'} />
                                                <PolarAngleAxis dataKey="topic" tick={CustomTick} />
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
                                    ) : (
                                        <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                                    )}
                                </div>
                            </div>
                            <div className="flex h-[190px] flex-col items-start justify-start gap-3 self-stretch bg-[#fefefe] px-4 py-3">
                                <div className="flex flex-row border-b border-gray-200 text-base font-semibold text-gray-700">
                                    {t('boostbot.modal.audienceGender')}
                                    <Tooltip
                                        content={t(`tooltips.boostBotGender.title`)}
                                        detail={t(`tooltips.boostBotGender.description`)}
                                        position="bottom-right"
                                        className="w-fit"
                                    >
                                        <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                    </Tooltip>
                                </div>

                                <ResponsiveContainer width={320} height={140}>
                                    <BarChart
                                        data={processedData}
                                        margin={{
                                            top: 32,
                                            right: 16,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} horizontal={false} />
                                        <XAxis
                                            dataKey="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10 }}
                                        />
                                        <YAxis width={16} tick={false} axisLine={false} />
                                        <Bar dataKey="female" fill="#FAA7E0" radius={2} />
                                        <Bar dataKey="male" fill="#84CAFF" radius={2} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-8 self-stretch">
                            <div className="flex h-[306px] flex-col items-start justify-start gap-3 self-stretch">
                                <div className="flex h-8 flex-col items-start justify-start gap-1 self-stretch">
                                    <div className="self-stretch font-['Poppins'] text-lg font-semibold tracking-tight text-gray-800">
                                        <div className="flex flex-row border-b border-gray-200 text-base font-semibold text-gray-700">
                                            {t('boostbot.modal.audienceEngagementStats')}
                                            <Tooltip
                                                content={t(`tooltips.boostBotEngagementRate.title`)}
                                                detail={t(`tooltips.boostBotEngagementRate.description`)}
                                                position="bottom-left"
                                                className="w-fit"
                                            >
                                                <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <StatCard
                                    title={t('boostbot.modal.engagedAudience')}
                                    stat={
                                        (platform === 'youtube'
                                            ? audienceEngagementRateYT
                                            : audienceEngagementRateIGandTT) ?? '-'
                                    }
                                    iconName={
                                        platform === 'youtube'
                                            ? evaluateStat({ audienceEngagementRateYTInt })
                                            : evaluateStat({ engagementRateRaw })
                                    }
                                />

                                <div className="grid grid-cols-2 space-x-3">
                                    <StatCard title={t('boostbot.modal.followers')} stat={followers ?? '-'} />
                                    {avgViewsRaw && (
                                        <StatCard
                                            title={t('boostbot.modal.averageViews')}
                                            stat={avgViews ?? '-'}
                                            iconName={evaluateStat({ avgViewsRaw })}
                                            tooltip={'boostBotAvgViews'}
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
                            <div className="flex h-[167px] flex-col items-start justify-start gap-2.5 self-stretch">
                                <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                                    {t('boostbot.modal.channelStats')}
                                </div>
                                <div className="grid grid-cols-2 space-x-3">
                                    {followersGrowthRaw !== undefined && (
                                        <StatCard
                                            title={t('boostbot.modal.followersGrowth')}
                                            stat={followersGrowth ?? '-'}
                                            iconName={evaluateStat({ followersGrowthRaw })}
                                            tooltip={'boostBotFollowerGrowth'}
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
                    </div>
                </div>
            </>
        </Modal>
    );
}
