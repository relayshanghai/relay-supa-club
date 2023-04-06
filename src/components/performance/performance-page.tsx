import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Layout } from 'src/components/layout';
import { ArrowRight, BoxFilled, ThumbUpOutline } from '../icons';
import { EyeOutline } from '../icons';
import { ChatBubbleTextOutline } from '../icons';
import SalesBarChart from './sales-bar-chart';
import demoData from './demo.json';
import { toCurrency, numFormatter } from 'src/utils/utils';

export interface PerformanceData {
    company_id: string;
    posts: number;
    sales: number;
    likes: number;
    comments: number;
    views: number;
}

const PerformancePage = () => {
    const { t } = useTranslation();
    const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
    //a function to get the data, currently using a demo json file, in next iteration will be replaced with a fetch request to supabase db
    const getPerformanceData = () => {
        if (demoData) {
            const { data } = demoData;
            setPerformanceData(data);
        }
    };

    const SocialStats = [
        {
            icon: ThumbUpOutline,
            label: t('performance.stats.likes'),
            value: performanceData ? numFormatter(performanceData.likes) : '',
        },
        {
            icon: ChatBubbleTextOutline,
            label: t('performance.stats.comments'),
            value: performanceData ? numFormatter(performanceData.comments) : '',
        },
        {
            icon: EyeOutline,
            label: t('performance.stats.views'),
            value: performanceData ? numFormatter(performanceData.views) : '',
        },
    ];

    const statCardStyle =
        'flex flex-col bg-white p-6 space-y-6 shadow hover:shadow-md rounded-lg hover:text-primary-500 hover:stroke-primary-500 transition duration-500 ease-in-out hover:cursor-default';

    useEffect(() => {
        getPerformanceData();
    }, []);

    return (
        <Layout>
            <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center bg-gray-50">
                {performanceData && (
                    <div className="m-6 flex flex-col items-start justify-center space-y-9 text-gray-700 ">
                        <div className="flex flex-col items-start justify-start space-y-2">
                            <h2 className="text-2xl tracking-wide ">{t('performance.title')}</h2>
                            <p className="text-xs leading-none tracking-wide ">
                                {t('performance.allCampaignsFor')}TimeKettle
                            </p>
                            {/* To be replaced with a date range picker in next iteration */}
                            <div className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 p-1">
                                <p className="text-xs leading-none tracking-wide ">2023-01-01 to 2023-04-01</p>
                            </div>
                        </div>
                        <div className="md:grid-row-2 flex flex-col gap-4 md:grid md:grid-cols-4 ">
                            <div className={`${statCardStyle} row-span-2 flex flex-col justify-between text-center`}>
                                <div className="flex flex-col space-y-6">
                                    <h4 className="text-base">{t('performance.stats.posts')}</h4>
                                    <h1 className="text-4xl font-semibold">{numFormatter(performanceData?.posts)}</h1>
                                </div>
                                {/* To enable to click and redirect to all posts page in next iteration */}
                                <div className="flex h-28 w-full items-start justify-center rounded-xl bg-gradient-to-r from-primary-400 via-primary-200 to-primary-200 hover:cursor-pointer">
                                    <div className="flex items-center">
                                        <ArrowRight className="stroke-white" />
                                        <BoxFilled className="" />
                                    </div>
                                </div>
                            </div>
                            <div className="hover:text -primary-500 col-span-3 flex space-y-6 rounded-lg bg-white p-6 shadow transition duration-500 ease-in-out hover:cursor-default hover:stroke-primary-500 hover:shadow-md ">
                                <div className="flex w-1/2 flex-col space-y-6">
                                    <h4 className="text-base">{t('performance.stats.sales')}</h4>

                                    <h1 className="text-4xl font-semibold">{toCurrency(performanceData?.sales, 0)}</h1>
                                </div>

                                <div className="w-1/2">
                                    <SalesBarChart />
                                </div>
                            </div>
                            {SocialStats.map((stat, index) => (
                                <div className={statCardStyle} key={index}>
                                    <stat.icon className=" stroke-gray-700" />
                                    <div>
                                        <h4 className="text-base">{stat.label}</h4>
                                        <h1 className="text-2xl font-semibold">{stat.value}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PerformancePage;
