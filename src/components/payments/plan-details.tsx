import { useTranslation } from 'react-i18next';
import { PriceDetailsCard } from '../pricing/price-details-card';

export const PlanDetails = () => {
    const priceTier = 'discovery';
    const { t } = useTranslation();

    return (
        <div className="flex h-[450px] max-w-sm flex-col rounded-md bg-white p-6">
            <div className="mt-10 pr-4 text-5xl font-semibold">{t(`pricing.${priceTier}.title`)}</div>
            <p className="text-wrap mt-4 text-xs text-gray-500">{t(`pricing.${priceTier}.subTitle`)}</p>
            <h3 className="mb-3 mt-12 inline text-4xl font-semibold text-gray-700">
                {priceTier === 'discovery' ? '¥299' : '¥880'}
                <p className="ml-1 inline text-xs text-gray-400">{t('pricing.perMonth')}</p>
            </h3>
            <div className="my-3 flex gap-x-5">
                <PriceDetailsCard priceTier={priceTier} size="small" />
            </div>
        </div>
    );
};
