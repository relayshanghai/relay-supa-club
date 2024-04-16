// @ts-nocheck
import { useTranslation } from 'react-i18next';
import { Modal } from 'src/components/modal';
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
import StatCard from 'src/components/boostbot/stat-card';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import { evaluateStat, processedAudienceDemoData } from 'src/utils/api/boostbot/helper';
import { Tooltip } from 'src/components/library';
import { Question } from 'src/components/icons';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import { useReport } from 'src/hooks/use-report';
import type { SearchTableInfluencer } from 'types';

export type ProfileChannelSection = {
    name: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    trackingCode: string;
    fullAddress: string;
};

type Props = {
    profile: SearchTableInfluencer;
    onUpdate?: (key: keyof ProfileChannelSection, value: any) => void;
};

export default function ProfileChannel({ ...props }: Props) {
    const { t, i18n } = useTranslation();
    const platform = props.profile?.url ? extractPlatformFromURL(props.profile?.url) : 'youtube';
    const { report: _report } = useReport({ platform: platform ?? 'youtube', creator_id: props.profile?.iqdata_id });

    if (!props.profile) {
        return null;
    }

    const influencer = props.profile;
    const {
        avg_views: avgViewsRaw,
        avg_reels_plays: avgReelsPlaysRaw, // this is avg views for instagram
        engagement_rate: engagementRateRaw,
        posts_count: totalPosts,
        followers: followersRaw,
        followers_growth: followersGrowthRaw,
        engagements,
    } = influencer;

    // @note get platform from url for now
    //       `influencer` was supposed to be `UserProfile` type which contains `type` for platform but it's not there on runtime

    // convert raw decimal numbers to string percentage
    const followers = numberFormatter(followersRaw, 0);
    const avgViews = numberFormatter(avgViewsRaw, 0) || numberFormatter(avgReelsPlaysRaw, 0);
    const followersGrowth = decimalToPercent(followersGrowthRaw, 0);
    // audience engagement rate for Youtube = (Engagements + Avg Views) / Followers see V2-1063
    const audienceEngagementRateYTInt = Number((engagements + (avgViewsRaw ?? 0)) / followersRaw);
    const audienceEngagementRateYT = decimalToPercent(audienceEngagementRateYTInt, 0);
    // audience engagement rate for Instagram and Tiktok is just engagmentRate see V2-1063
    const audienceEngagementRateIGandTT = decimalToPercent(engagementRateRaw, 0);

    const _handleAddToSequence = () => {
        setSelectedInfluencers({ [selectedRow.id]: true });
        setShowSequenceSelector(true);
        // TODO: add to sequence function in V2-1029
    };

    // Used to break multiline labels into multiple tspans to prevent text overflow
    function CustomizedTick({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
        return (
            <text x={x} y={y} dy={-4} fill={'black'} fontSize={10} textAnchor="middle">
                {payload.value.split(' ').map((word: string, index: number) => (
                    <tspan key={index} x={x} dy={index ? '1.2em' : 0}>
                        {word}
                    </tspan>
                ))}
            </text>
        );
    }

    const processedDemoData = processedAudienceDemoData(influencer);
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
    if (!platform) {
        return (
            <Modal
                maxWidth="max-w-3xl"
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                data-testid="boostbot-influencer-detail-modal"
            >
                <p>{t('account.personal.oopsWentWrong')}</p>
            </Modal>
        );
    }

    return (
        <section className="overflow-clip p-6">
            <div className="flex flex-col items-center justify-center gap-4">
                {/* stats - top niches and audience engagement */}
                <div className="w-full space-y-3">
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
                    <StatCard
                        title={t('boostbot.modal.engagedAudience')}
                        stat={
                            (platform === 'youtube' ? audienceEngagementRateYT : audienceEngagementRateIGandTT) ?? '-'
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

                {/* stats - audience gender and channel stats */}
                <div className="w-full space-y-3">
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
                <div className="w-full px-3">
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

                    <ResponsiveContainer width={300} height={160}>
                        <BarChart
                            data={processedDemoData}
                            margin={{
                                top: 32,
                                right: 16,
                            }}
                        >
                            <CartesianGrid vertical={false} horizontal={false} />
                            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis width={16} tick={false} axisLine={false} />
                            <Bar dataKey="female" fill="#FAA7E0" radius={2} />
                            <Bar dataKey="male" fill="#84CAFF" radius={2} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-full px-3">
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
                    <div className={`w-full`}>
                        {!props.profile.influencer_niche_graph || props.profile.influencer_niche_graph.length === 0 ? (
                            <div className="relative flex h-[280px] w-80 items-center justify-center">
                                <p className="left-[42%] top-[45%] flex text-center text-lg font-semibold">
                                    {t('boostbot.modal.noNichesFound')}
                                </p>
                                <ResponsiveContainer className="absolute" width={320} height={280}>
                                    <RadarChart cx="50%" cy="50%" outerRadius={90} data={emptyStateChartData}>
                                        <PolarGrid stroke="#c1c5cb" />
                                        <PolarAngleAxis dataKey="subject" tick={CustomizedTick} />
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
                        ) : (
                            <ResponsiveContainer width={300} height={300}>
                                <RadarChart
                                    outerRadius={100}
                                    cx="50%"
                                    cy="50%"
                                    data={props.profile.influencer_niche_graph?.map((topic) => ({
                                        ...topic,
                                        topic: i18n.language === 'en-US' ? topic.topic_en : topic.topic_zh,
                                    }))}
                                >
                                    <PolarGrid stroke={'#e5e7eb'} />
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
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
