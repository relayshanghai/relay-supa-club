import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { Switch } from '../library';
import {
    STRIPE_PRICE_MONTHLY_DIY,
    STRIPE_PRICE_MONTHLY_DIY_MAX,
    STRIPE_PRICE_QUARTERLY_DIY,
    STRIPE_PRICE_QUARTERLY_DIY_MAX,
} from 'src/utils/api/stripe/constants';
import { PriceDetailsCard } from './price-details-card';
// import { usePrices } from 'src/hooks/use-prices';

export const PricingSection = ({ setPriceId }: { setPriceId: (priceId: string) => void }) => {
    const [period, setPeriod] = useState<'monthly' | 'quarterly'>('quarterly');
    const [subscriptionType, setSubscriptionType] = useState<'diy' | 'diyMax'>('diyMax');
    // const { prices } = usePrices();

    useEffect(() => {
        let priceId = STRIPE_PRICE_MONTHLY_DIY;
        if (subscriptionType === 'diyMax') {
            if (period === 'quarterly') {
                priceId = STRIPE_PRICE_QUARTERLY_DIY_MAX;
            } else {
                priceId = STRIPE_PRICE_MONTHLY_DIY_MAX;
            }
        } else {
            if (period === 'quarterly') {
                priceId = STRIPE_PRICE_QUARTERLY_DIY;
            }
        }
        setPriceId(priceId);
    }, [period, setPriceId, subscriptionType]);

    return (
        <div>
            <Switch
                checked={period === 'quarterly'}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPeriod(e.target.checked ? 'quarterly' : 'monthly');
                }}
                afterLabel="Quarterly"
            />
            <div className="divide-x-2 divide-gray-200">
                <button
                    className={`pr-4 text-5xl font-semibold ${
                        subscriptionType === 'diyMax' ? 'text-gray-700' : 'text-gray-300'
                    }`}
                    onClick={() => setSubscriptionType('diyMax')}
                >
                    DIY Max
                </button>
                <button
                    className={`pl-4 text-5xl font-semibold ${
                        subscriptionType === 'diyMax' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    onClick={() => setSubscriptionType('diy')}
                >
                    DIY
                </button>
            </div>
            <p className="text-xs text-gray-400">For those looking to scale</p>

            <div>
                <PriceDetailsCard subscriptionType={subscriptionType} />
            </div>
        </div>
    );
};
