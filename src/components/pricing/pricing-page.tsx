import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActiveSubscriptionPeriod, ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { usePrices } from 'src/hooks/use-prices';
import { useSubscription } from 'src/hooks/use-subscription';
import type { SubscriptionConfirmModalData } from '../account/subscription-confirm-modal';
import { SubscriptionConfirmModal } from '../account/subscription-confirm-modal';
import { Switch } from '../library';
import { PriceCard } from './price-card';
import { Button } from '../button';
import { useRouter } from 'next/router';

export const PricingPage = ({ page = 'upgrade' }: { page: 'upgrade' | 'landing' }) => {
    const landingPage = page === 'landing';
    const { t } = useTranslation();
    const router = useRouter();
    const [period, setPeriod] = useState<ActiveSubscriptionPeriod>('quarterly');
    const [confirmModalData, setConfirmModalData] = useState<SubscriptionConfirmModalData | null>(null);
    const { createSubscription } = useSubscription();

    const prices = usePrices();

    const openConfirmModal = (priceTier: ActiveSubscriptionTier, period: ActiveSubscriptionPeriod, priceId: string) => {
        setConfirmModalData({ priceTier, period, priceId, price: prices[period][priceTier] });
    };
    const options = ['free', 'diy', 'diyMax'] as ActiveSubscriptionTier[];

    const handleStartFreeTrialClicked = () => {
        router.push('/signup');
    };

    return (
        <main className="flex-grow pt-10">
            <SubscriptionConfirmModal
                confirmModalData={confirmModalData}
                setConfirmModalData={setConfirmModalData}
                createSubscription={createSubscription}
            />

            <div className="container mx-auto flex flex-col items-center">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="font-heading mb-6 mt-4 text-3xl font-semibold text-gray-800 md:text-4xl">
                        {t('pricing.justGettingStartedOrScalingUp')}
                    </h2>
                    <p className="text-3xl font-semibold text-primary-700 md:text-4xl">
                        {t('pricing.relayClubCanHelp')}
                    </p>
                </div>
                <Switch
                    wrapperClassName="mb-2"
                    checked={period === 'quarterly'}
                    onChange={(e) => {
                        setPeriod(e.target.checked ? 'quarterly' : 'monthly');
                    }}
                    beforeLabel={t('pricing.monthly') || 'Monthly'}
                    afterLabel={t('pricing.quarterly') || 'Quarterly'}
                />
                <div
                    className={`container m-auto flex ${
                        !landingPage ? 'min-h-[32rem]' : 'min-h-[20rem]'
                    } w-full max-w-screen-xl flex-wrap justify-center`}
                >
                    {options.map((option) => (
                        <PriceCard
                            key={option}
                            period={period}
                            priceTier={option}
                            openConfirmModal={openConfirmModal}
                            landingPage={landingPage}
                        />
                    ))}
                </div>
                {landingPage && (
                    <Button onClick={handleStartFreeTrialClicked} className="mt-2 !text-lg">
                        {t('pricing.startFreeTrial')}
                    </Button>
                )}
            </div>
        </main>
    );
};
