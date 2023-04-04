import { useTranslation } from 'react-i18next';
import { Layout } from 'src/components/layout';

const PerformancePage = () => {
    const { t } = useTranslation();

    const statCardStyle = 'bg-white p-6 shadow hover:shadow-md rounded-lg';

    return (
        <Layout>
            <div className="max-3xl inline-flex h-full w-full flex-col items-center justify-center bg-gray-50">
                <div className="flex flex-col items-start justify-start space-y-9 text-gray-700">
                    <div className="flex flex-col items-start justify-start space-y-2">
                        <h2 className="text-2xl tracking-wide ">Performance</h2>
                        <p className="text-xs leading-none tracking-wide ">
                            All campaigns for TimeKettle
                        </p>
                        {/* To be replaced with a date range picker in next iteration */}
                        <div className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 p-1">
                            <p className="text-xs leading-none tracking-wide ">
                                2023-01-01 to 2023-04-01
                            </p>
                        </div>
                    </div>
                    <div className="md:grid-row-2 flex flex-col gap-4 md:grid md:grid-cols-4 ">
                        <div className={`${statCardStyle} row-span-2 `}>Posts</div>
                        <div className={`${statCardStyle} col-span-3 `}>Sales</div>
                        <div className={statCardStyle}>Views</div>
                        <div className={statCardStyle}>Views</div>
                        <div className={statCardStyle}>Views</div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PerformancePage;
