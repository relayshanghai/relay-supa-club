import { useEffect, useState } from 'react';
import { Switch } from '../library';
import { PriceDetailsCard } from '../pricing/price-details-card';
import type { ActiveSubscriptionPeriod, ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { PRICE_IDS, usePrices } from 'src/hooks/use-prices';
import { useTranslation } from 'react-i18next';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import {
    PricingSectionSelectDiy,
    PricingSectionSelectDiyMax,
    PricingSectionToggleMonthlyOrQuarterly,
} from 'src/utils/analytics/events';

export const PricingSection = ({ setPriceId }: { setPriceId: (priceId: string) => void }) => {
    const { t } = useTranslation();
    const { track } = useRudderstackTrack();

    const [period, setPeriod] = useState<ActiveSubscriptionPeriod>('quarterly');
    const [priceTier, setPriceTier] = useState<ActiveSubscriptionTier>('diyMax');
    const prices = usePrices();

    useEffect(() => {
        setPriceId(PRICE_IDS[period][priceTier]);
    }, [period, setPriceId, priceTier]);

    return (
        <div className="flex flex-col bg-white p-6">
            <Switch
                wrapperClassName="self-end"
                checked={period === 'quarterly'}
                onChange={(e) => {
                    setPeriod(e.target.checked ? 'quarterly' : 'monthly');
                    track(PricingSectionToggleMonthlyOrQuarterly, {
                        selectedPeriod: period,
                    });
                }}
                afterLabel={t('pricing.quarterly') || 'Quarterly'}
            />
            <div className="mt-10 divide-x-2 divide-gray-200">
                <button
                    className={`pr-4 text-5xl font-semibold ${
                        priceTier === 'diyMax' ? 'text-gray-700' : 'text-gray-300'
                    }`}
                    onClick={() => {
                        setPriceTier('diyMax');
                        // @note previously trackEvent(SIGNUP_WIZARD('Pricing Section, click to select DIY Max'));
                        track(PricingSectionSelectDiyMax);
                    }}
                >
                    DIY Max
                </button>
                <button
                    className={`pl-4 text-5xl font-semibold ${
                        priceTier === 'diyMax' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    onClick={() => {
                        setPriceTier('diy');
                        // @note previously trackEvent(SIGNUP_WIZARD('Pricing Section, click to select DIY'));
                        track(PricingSectionSelectDiy);
                    }}
                >
                    DIY
                </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">{t('pricing.forThoseLookingToScale')}</p>

            <div className="mt-12 flex gap-x-5">
                <PriceDetailsCard priceTier={priceTier} size="small" />
                <div className="flex min-w-fit flex-col justify-end text-right">
                    <h3 className="mb-3 inline text-4xl font-semibold text-gray-700">
                        {prices ? prices[period][priceTier] ?? '$349' : '$349'}
                        <p className="ml-1 inline text-xs text-gray-400">{t('pricing.perMonth')}</p>
                    </h3>
                    <div>
                        <h4 className="inline text-gray-500">
                            {period === 'monthly' ? t('pricing.billedMonthly') : t(`pricing.billedQuarterly`)}{' '}
                            <h3 className="inline underline">after</h3>
                        </h4>
                        <h3 className="text-primary-600">{t('pricing.thirtyDayFreeTrial')}</h3>
                    </div>
                </div>
            </div>
            <div className="mt-20 self-end text-right align-bottom">
                <h2 className="text-4xl font-semibold text-gray-700">{t('pricing.noChargeToday')}</h2>
                <h3 className="mt-3 text-primary-600">{t('pricing.getStartedWithYourFreeTrial')}</h3>
            </div>
        </div>
    );
};
