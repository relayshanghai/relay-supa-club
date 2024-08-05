import { useTranslation } from 'react-i18next';
import { PriceDetailsCard } from '../pricing/price-details-card';
import {
    useLocalStoragePaymentPeriod,
    useLocalStorageSelectedPrice,
    type ActiveSubscriptionTier,
} from 'src/hooks/use-prices';

export const PlanDetails = ({ priceTier }: { priceTier: ActiveSubscriptionTier }) => {
    const { t } = useTranslation();
    const [selectedPrice] = useLocalStorageSelectedPrice();
    const [paymentPeriod] = useLocalStoragePaymentPeriod();

    const periodText = () => {
        if (paymentPeriod.period === 'monthly') {
            return selectedPrice.currency === 'usd' ? t('pricing.usdPerMonth') : t('pricing.rmbPerMonth');
        } else if (paymentPeriod.period === 'annually') {
            return selectedPrice.currency === 'usd' ? t('pricing.usdPerYear') : t('pricing.rmbPerYear');
        }
    };

    return (
        <div className="flex min-h-[450px] max-w-sm flex-col rounded-lg border-2 border-gray-300 bg-white p-6">
            <h1 className="relative mt-10 w-fit text-4xl font-semibold text-gray-800">
                {t(`pricing.${priceTier}.title`)}
                <p className="absolute -right-12 top-0 mr-2 text-sm font-semibold text-pink-500">{t('pricing.beta')}</p>
            </h1>
            <p className="text-wrap mt-4 text-xs text-gray-500">{t(`pricing.${priceTier}.subTitle`)}</p>
            <div className=" mt-12 ">
                {selectedPrice.forExistingUser ? (
                    <h4 className="line-through">
                        {selectedPrice.prices[paymentPeriod.period]}
                        {selectedPrice.currency === 'cny' ? 'RMB' : 'USD'} {periodText()}
                    </h4>
                ) : (
                    <></>
                )}
                <h3 className="mb-3 inline text-4xl font-semibold text-gray-700">
                    {selectedPrice.forExistingUser
                        ? selectedPrice.forExistingUser[paymentPeriod.period]
                        : selectedPrice.prices[paymentPeriod.period]}{' '}
                    {selectedPrice.currency === 'cny' ? 'RMB' : 'USD'}
                    <p className="ml-1 inline text-xs text-gray-400">{periodText()}</p>
                </h3>
            </div>
            <div className="my-3 flex gap-x-5">
                <PriceDetailsCard priceTier={priceTier} size="small" />
            </div>
        </div>
    );
};
