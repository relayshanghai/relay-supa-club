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

export const PricingPage = ({ page = 'upgrade' }: { page?: 'upgrade' | 'landing' }) => {
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
    const options: ActiveSubscriptionTier[] = landingPage ? ['free', 'diyMax', 'diy'] : ['diyMax', 'diy'];

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
                    <h4 className="-mt-2 text-3xl font-semibold text-primary-500 md:text-4xl">
                        {t('pricing.relayClubCanHelp')}
                    </h4>
                </div>
                <div className="relative">
                    <Switch
                        size={4}
                        wrapperClassName="mb-2"
                        checked={period === 'quarterly'}
                        onChange={(e) => {
                            setPeriod(e.target.checked ? 'quarterly' : 'monthly');
                        }}
                        beforeLabel={t('pricing.monthly') || 'Monthly'}
                        afterLabel={t('pricing.quarterly') || 'Quarterly'}
                    />
                    <p className="-right-15 -top-15 absolute">Save 15%</p>
                </div>
                <div
                    className={`container m-auto flex ${
                        landingPage ? 'min-h-[30rem]' : 'min-h-[32rem]'
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
                    <Button onClick={handleStartFreeTrialClicked} className="mb-20 mt-2 !text-xl">
                        {t('pricing.startFreeTrial')}
                    </Button>
                )}
            </div>
        </main>
    );
};
