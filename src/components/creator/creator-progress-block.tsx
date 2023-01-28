import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { chinaFilter } from 'src/utils/utils';

export const ProgressBlock = ({
    stats: statsFull,
    title,
}: {
    stats: { name: string; weight: number }[];
    title: string;
}) => {
    const [showMore, setShowMore] = useState(false);
    const { t } = useTranslation();
    const stats = showMore ? statsFull : statsFull.slice(0, 5);
    if (stats.length === 0) return null;

    return (
        <div>
            <div className="font-semibold text-gray-600 mb-2">{t(`creators.show.${title}`)}</div>
            {stats.map((stat, index: number) => (
                <div key={index}>
                    <div className="bg-white rounded-lg p-1.5 mb-2">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-gray-600">
                                {stat.name ? chinaFilter(stat.name) : ''}
                            </div>
                            <div className="text-sm text-gray-600">{stat.weight.toFixed(2)}%</div>
                        </div>
                        <div className="relative pt-1">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
                                <div
                                    style={{ width: `${stat.weight * 100}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={() => setShowMore(!showMore)} className="justify-self-end">
                <p className="text-primary-500 hover:text-primary-700 duration-300 font-semibold text-sm text-right">
                    {showMore ? t('creators.show.seeLess') : t('creators.show.seeMore')}
                </p>
            </button>
        </div>
    );
};
