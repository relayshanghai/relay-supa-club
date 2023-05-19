import { useTranslation } from 'react-i18next';
import type { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { Layout } from 'src/components/layout';
import { ArrowRight, BoxFilled, Spinner, ThumbUpOutline } from '../icons';
import { EyeOutline } from '../icons';
import { ChatBubbleTextOutline } from '../icons';
import SalesBarChart from './sales-bar-chart';
import { toCurrency, numFormatter } from 'src/utils/utils';
import { useCampaigns } from 'src/hooks/use-campaigns';
import type { CampaignDB, ProfileDB } from 'src/utils/api/db';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import type {
    PostsPerformanceByCampaignGetResponse,
    PostsPerformanceByCampaignGetQuery,
} from 'pages/api/post-performance/by-campaign';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger-client';
import type {
    PostsPerformanceByPostGetQuery,
    PostsPerformanceByPostGetResponse,
} from 'pages/api/post-performance/by-post';

type PostPerformanceByCampaign = { [campaignId: string]: PostsPerformanceByCampaignGetResponse };

const pollForFreshData = async ({
    post,
    profile,
    campaign,
    oneDayAgo,
    setPerformanceData,
}: {
    post: PostsPerformanceByPostGetResponse;
    campaign: CampaignDB;
    profile: ProfileDB;
    oneDayAgo: Date;
    setPerformanceData: (value: SetStateAction<PostPerformanceByCampaign | null>) => void;
}) => {
    const interval = setInterval(async () => {
        try {
            const updatedData = await nextFetchWithQueries<
                PostsPerformanceByPostGetQuery,
                PostsPerformanceByPostGetResponse
            >('post-performance/by-post', {
                id: post.id,
                profileId: profile.id,
            });

            if (new Date(updatedData.updatedAt) > oneDayAgo) {
                setPerformanceData((prev) => {
                    if (!prev) return prev;
                    const updated = prev[campaign.id].map((prevPost) => {
                        if (prevPost.url === post.url) return updatedData;
                        return prevPost;
                    });
                    return { ...prev, [campaign.id]: updated };
                });
                clearInterval(interval);
            }
        } catch (error) {
            clientLogger(error, 'error');
        }
    }, 10000);
};

const PerformancePage = () => {
    const { t } = useTranslation();
    const [performanceData, setPerformanceData] = useState<PostPerformanceByCampaign | null>(null);
    const { profile } = useUser();
    const { campaigns } = useCampaigns({});
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignDB | null>(null);
    const [fetching, setFetching] = useState<boolean>(true);
    //a function to get the data, currently using a demo json file, in next iteration will be replaced with a fetch request to supabase db

    const selectedStats = performanceData && selectedCampaign ? performanceData[selectedCampaign?.id] : null;

    const likesTotal = selectedStats?.reduce((acc, curr) => (curr.likeCount ? acc + curr.likeCount : acc), 0);

    const commentsTotal = selectedStats?.reduce((acc, curr) => (curr.commentCount ? acc + curr.commentCount : acc), 0);

    const viewsTotal = selectedStats?.reduce((acc, curr) => (curr.viewCount ? acc + curr.viewCount : acc), 0);

    const salesTotal = selectedStats?.reduce((acc, curr) => (curr.sales ? acc + curr.sales : acc), 0);

    const postsTotal = selectedStats?.length;

    const totals = {
        likes: {
            Icon: ThumbUpOutline,
            label: t('performance.stats.likes'),
            value: likesTotal ? numFormatter(likesTotal) : '',
        },
        comments: {
            Icon: ChatBubbleTextOutline,
            label: t('performance.stats.comments'),
            value: commentsTotal ? numFormatter(commentsTotal) : '',
        },
        views: {
            Icon: EyeOutline,
            label: t('performance.stats.views'),
            value: viewsTotal ? numFormatter(viewsTotal) : '',
        },
    };

    useEffect(() => {
        const getPerformanceData = async (campaigns: CampaignDB[]) => {
            if (!profile?.id) return;
            if (!campaigns || campaigns.length === 0) return;

            try {
                setFetching(true);
                const result: PostPerformanceByCampaign = {};
                for (const campaign of campaigns) {
                    const data = await nextFetchWithQueries<
                        PostsPerformanceByCampaignGetQuery,
                        PostsPerformanceByCampaignGetResponse
                    >('post-performance/by-campaign', {
                        campaignId: campaign.id,
                        profileId: profile.id,
                    });
                    result[campaign.id] = data;
                    // if data is stale (older than 1 day), set up a 10s poll to check for the new data. remove the poll when the data is updated
                    const now = new Date();
                    const oneDay = 1000 * 60 * 60 * 24;
                    const oneDayAgo = new Date(now.getTime() - oneDay);
                    for (const post of data) {
                        // console.log({
                        //     stale: new Date(post.updatedAt) > oneDayAgo,
                        //     updated_at: new Date(post.updatedAt),
                        //     oneDayAgo,
                        //     url: post.url,
                        // });
                        if (new Date(post.updatedAt) < oneDayAgo) {
                            pollForFreshData({ post, campaign, profile, oneDayAgo, setPerformanceData });
                        }
                    }
                }
                setPerformanceData(result);
                setSelectedCampaign(campaigns[0]);
            } catch (error) {
                clientLogger(error, 'error');
            }
            setFetching(false);
        };
        getPerformanceData(campaigns);
    }, [campaigns, profile]);

    return (
        <Layout>
            <section className="mx-auto flex w-11/12 max-w-screen-xl flex-col items-center justify-center bg-gray-50 md:h-full">
                {
                    <div className="flex h-full flex-col items-start justify-center p-8 text-gray-700 md:w-full">
                        <div className="mb-9 flex min-h-fit flex-col items-start justify-start space-y-2">
                            <h2 className="text-2xl font-medium ">{t('performance.title')}</h2>
                            <p className="text-xs leading-none ">{selectedCampaign?.name}</p>
                        </div>
                        <div className="lg:grid-row-2 flex w-full flex-col gap-5 lg:grid lg:grid-cols-4 ">
                            {/* min width 168px is from figma design, it also gives the card a reasonable width for large digits */}
                            <div className="group row-span-2 flex min-w-fit flex-col justify-between space-y-6 rounded-2xl bg-white p-6 text-center shadow transition duration-500 ease-in-out hover:scale-105 hover:cursor-default hover:stroke-primary-500 hover:text-primary-500 hover:shadow-md">
                                <div className="flex flex-col items-start space-y-6 md:items-center ">
                                    <h4 className="text-base">{t('performance.stats.posts')}</h4>
                                    {fetching ? (
                                        <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                                    ) : (
                                        <h1 className="text-2xl font-semibold md:text-4xl">
                                            {numFormatter(postsTotal || 0)}
                                        </h1>
                                    )}
                                </div>
                                {/* To enable to click and redirect to all posts page in next iteration, unhide the ArrowRight Icon when its enabled and add "All Posts" text */}
                                <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-r from-primary-400 via-primary-200 to-primary-200 hover:cursor-pointer ">
                                    <div className="flex items-center">
                                        <ArrowRight className="hidden stroke-white" />
                                        <BoxFilled className="" />
                                    </div>
                                </div>
                            </div>
                            <div className="hover:scale-10 group col-span-3  flex min-w-fit space-y-6 rounded-lg bg-white p-6 shadow transition duration-500 ease-in-out hover:scale-105 hover:cursor-default hover:stroke-primary-500 hover:text-primary-500 hover:shadow-md">
                                <div className="flex w-1/2 flex-col space-y-6 transition duration-500 ease-in-out group-hover:text-primary-500 ">
                                    <h4 className="text-base">{t('performance.stats.sales')}</h4>

                                    <h1 className="text-2xl font-semibold md:text-4xl">
                                        {toCurrency(salesTotal || 0, 0)}
                                    </h1>
                                </div>

                                <div className="invisible w-1/2 md:visible">
                                    <SalesBarChart />
                                </div>
                            </div>
                            {Object.values(totals).map((total, index) => (
                                <div
                                    className="group flex min-w-[168px] flex-col space-y-6 rounded-2xl bg-white p-6 shadow transition duration-500 ease-in-out hover:scale-105 hover:cursor-default hover:stroke-primary-500 hover:text-primary-500 hover:shadow-md"
                                    key={index}
                                >
                                    <total.Icon className=" stroke-gray-700 group-hover:stroke-primary-500" />
                                    <div>
                                        <h4 className="text-base">{total.label}</h4>
                                        <h1 className="text-2xl font-semibold">{total.value}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </section>
        </Layout>
    );
};

export default PerformancePage;
