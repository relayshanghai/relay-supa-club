import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { Switch } from '../library';
import { PriceDetailsCard } from './price-details-card';
import { PRICE_IDS, usePrices } from 'src/hooks/use-prices';
import type { SubscriptionPeriod, SubscriptionTier } from 'types';

export const PricingSection = ({ setPriceId }: { setPriceId: (priceId: string) => void }) => {
    const [period, setPeriod] = useState<SubscriptionPeriod>('quarterly');
    const [priceTier, setPriceTier] = useState<SubscriptionTier>('diyMax');
    const prices = usePrices();

    useEffect(() => {
        setPriceId(PRICE_IDS[period][priceTier]);
    }, [period, setPriceId, priceTier]);

    return (
        <div className="flex flex-col bg-white p-6">
            <Switch
                wrapperClassName="self-end"
                checked={period === 'quarterly'}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPeriod(e.target.checked ? 'quarterly' : 'monthly');
                }}
                afterLabel="Quarterly"
            />
            <div className="mt-10 divide-x-2 divide-gray-200">
                <button
                    className={`pr-4 text-5xl font-semibold ${
                        priceTier === 'diyMax' ? 'text-gray-700' : 'text-gray-300'
                    }`}
                    onClick={() => setPriceTier('diyMax')}
                >
                    DIY Max
                </button>
                <button
                    className={`pl-4 text-5xl font-semibold ${
                        priceTier === 'diyMax' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    onClick={() => setPriceTier('diy')}
                >
                    DIY
                </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">For those looking to scale</p>

            <div className="mt-12 flex gap-x-5">
                <PriceDetailsCard priceTier={priceTier} />
                <div className="flex min-w-fit flex-col justify-end text-right">
                    <h3 className="mb-3 inline text-4xl font-semibold text-gray-700">
                        {prices ? prices[period][priceTier] ?? '$349' : '$349'}
                        <p className="ml-1 inline text-xs text-gray-400">/ month</p>
                    </h3>
                    <div>
                        <h4 className="inline text-gray-500">
                            Billed Quarterly <h3 className="inline underline">after</h3>
                        </h4>
                        <h3 className="text-primary-600">30 day free trial</h3>
                    </div>
                </div>
            </div>
            <div className="mt-20 self-end text-right align-bottom">
                <h2 className="text-4xl font-semibold text-gray-700">No Charge Today!</h2>
                <h3 className="mt-3 text-primary-600">Get started with your free trial</h3>
            </div>
        </div>
    );
};
