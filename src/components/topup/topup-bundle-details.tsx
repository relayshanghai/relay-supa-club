import { useTranslation } from 'react-i18next';
import { useLocalStoragePaymentPeriod, useLocalStorageSelectedPrice } from 'src/hooks/use-prices';
import { type TopUpSizes } from 'src/hooks/use-topups';
import { TopUpBundleDetailsCard } from './topup-bundle-details-card';

export const TopUpBundleDetails = ({ topUpSize }: { topUpSize: TopUpSizes }) => {
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
                {t(`pricing.${topUpSize.toLowerCase() as TopUpSizes}.title`)}
            </h1>
            <p className="text-wrap mt-4 text-xs text-gray-500">
                {t(`pricing.${topUpSize.toLowerCase() as TopUpSizes}.subTitle`)}
            </p>
            <div className=" mt-12 ">
                {selectedPrice.forExistingUser?.[paymentPeriod.period] ? (
                    <h4 className="line-through">
                        {selectedPrice.prices[paymentPeriod.period]}
                        {selectedPrice.currency === 'cny' ? 'RMB' : 'USD'} {periodText()}
                    </h4>
                ) : (
                    <></>
                )}
            </div>
            <div className="my-3 flex gap-x-5">
                <TopUpBundleDetailsCard topUpSize={topUpSize.toLowerCase() as TopUpSizes} />
            </div>
        </div>
    );
};
