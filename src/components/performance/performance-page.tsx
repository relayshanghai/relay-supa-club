import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Layout } from 'src/components/layout';
import { ArrowRight, BoxFilled, ThumbUpOutline } from '../icons';
import { EyeOutline } from '../icons';
import { ChatBubbleTextOutline } from '../icons';
import SalesBarChart from './sales-bar-chart';
import demoData from '../../mocks/demo.json';
import { toCurrency, numFormatter } from 'src/utils/utils';

export interface PerformanceData {
    company_id: string;
    company_name: string;
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

    useEffect(() => {
        getPerformanceData();
    }, []);

    return (
        <Layout>
            <section className="mx-auto flex h-[calc(100vh_-_3.5rem)] w-11/12 max-w-screen-xl flex-col items-center justify-center bg-gray-50">
                {performanceData && (
                    <div className="flex h-full flex-col items-start justify-center p-8 text-gray-900 md:w-full">
                        <div className="mb-9 flex min-h-fit flex-col items-start justify-start space-y-2">
                            <h2 className="text-2xl font-bold ">{t('performance.title')}</h2>
                            <p className="text-xs leading-none ">
                                {t('performance.allCampaignsFor')} {performanceData.company_name}
                            </p>
                            {/* To be replaced with a date range picker in next iteration */}
                            <div className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 p-1">
                                <p className="text-xs leading-none ">2023-01-01 to 2023-04-01</p>
                            </div>
                        </div>
                        <div className="lg:grid-row-2 flex w-full flex-col gap-5 lg:grid lg:grid-cols-4 ">
                            {/* min width 168px is from figma design, it also gives the card a reasonable width for large digits */}
                            <div className="group row-span-2 flex min-w-fit flex-col justify-between space-y-6 rounded-2xl bg-white p-6 text-center shadow transition duration-500 ease-in-out hover:scale-105 hover:cursor-default hover:stroke-primary-500 hover:text-primary-500 hover:shadow-md">
                                <div className="flex flex-col items-start space-y-6 md:items-center ">
                                    <h4 className="text-base">{t('performance.stats.posts')}</h4>
                                    <h1 className="text-2xl font-semibold md:text-4xl">
                                        {numFormatter(performanceData.posts)}
                                    </h1>
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
                                        {toCurrency(performanceData.sales, 0)}
                                    </h1>
                                </div>

                                <div className="invisible w-1/2 md:visible">
                                    <SalesBarChart />
                                </div>
                            </div>
                            {SocialStats.map((stat, index) => (
                                <div
                                    className="group flex min-w-[168px] flex-col space-y-6 rounded-2xl bg-white p-6 shadow transition duration-500 ease-in-out hover:scale-105 hover:cursor-default hover:stroke-primary-500 hover:text-primary-500 hover:shadow-md"
                                    key={index}
                                >
                                    <stat.icon className=" stroke-gray-700 group-hover:stroke-primary-500" />
                                    <div>
                                        <h4 className="text-base">{stat.label}</h4>
                                        <h1 className="text-2xl font-semibold">{stat.value}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    );
};

export default PerformancePage;
