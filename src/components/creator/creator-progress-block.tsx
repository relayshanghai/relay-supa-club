import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { decimalToPercent } from 'src/utils/formatter';
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
            <div className="mb-2 font-semibold text-gray-600">{t(`creators.show.${title}`)}</div>
            {stats.map((stat, index: number) => (
                <div key={index}>
                    <div className="mb-2 rounded-lg bg-white p-1.5">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-gray-600">
                                {stat.name ? chinaFilter(stat.name) : ''}
                            </div>
                            <div className="text-sm text-gray-600">{decimalToPercent(stat.weight)}</div>
                        </div>
                        <div className="relative pt-1">
                            <div className="mb-4 flex h-2 overflow-hidden rounded bg-primary-100 text-xs">
                                <div
                                    style={{ width: `${stat.weight * 100}%` }}
                                    className="flex flex-col justify-center whitespace-nowrap rounded bg-primary-500 text-center text-white shadow-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={() => setShowMore(!showMore)} className="justify-self-end">
                <p className="text-right text-sm font-semibold text-primary-500 duration-300 hover:text-primary-700">
                    {showMore ? t('creators.show.seeLess') : t('creators.show.seeMore')}
                </p>
            </button>
        </div>
    );
};
