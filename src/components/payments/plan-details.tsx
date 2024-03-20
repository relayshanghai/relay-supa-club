import { useTranslation } from 'react-i18next';
import { PriceDetailsCard } from '../pricing/price-details-card';
import type { ActiveSubscriptionTier } from 'src/hooks/use-prices';

export const PlanDetails = ({ priceTier }: { priceTier: ActiveSubscriptionTier }) => {
    const { t, i18n } = useTranslation();
    const en = i18n.language?.includes('en');

    let price;
    switch (priceTier) {
        case 'discovery':
            price = en ? '$41' : '¥299';
            break;
        case 'addPayment':
            price = en ? '$0' : '¥0';
            break;
        default:
            price = en ? '$110' : '¥799';
    }

    return (
        <div className="flex min-h-[450px] max-w-sm flex-col rounded-lg border-2 border-gray-300 bg-white p-6">
            <h1 className="relative mt-10 w-fit text-4xl font-semibold text-gray-800">
                {t(`pricing.${priceTier}.title`)}
                <p className="absolute -right-12 top-0 mr-2 text-sm font-semibold text-pink-500">{t('pricing.beta')}</p>
            </h1>
            <p className="text-wrap mt-4 text-xs text-gray-500">{t(`pricing.${priceTier}.subTitle`)}</p>
            <h3 className="mb-3 mt-12 inline text-4xl font-semibold text-gray-700">
                {price}
                <p className="ml-1 inline text-xs text-gray-400">{t('pricing.perMonth')}</p>
            </h3>
            <div className="my-3 flex gap-x-5">
                <PriceDetailsCard priceTier={priceTier} size="small" />
            </div>
        </div>
    );
};
