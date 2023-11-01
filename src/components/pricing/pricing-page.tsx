import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActiveSubscriptionPeriod, ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { usePrices } from 'src/hooks/use-prices';
import { useSubscription } from 'src/hooks/use-subscription';
import type { SubscriptionConfirmModalData } from '../account/subscription-confirm-modal';
import { SubscriptionConfirmModal } from '../account/subscription-confirm-modal';
import { PriceCard } from './price-card';
import { Button } from '../button';
import { useRouter } from 'next/router';
import { screenshots } from 'public/assets/imgs/screenshots';
import Image from 'next/image';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { LandingPageStartFreeTrialClicked } from 'src/utils/analytics/events';

const ImageBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] h-screen w-screen">
            <Image
                src={screenshots.discoverPageEn}
                alt="Background"
                fill
                quality={50}
                className="absolute h-full w-full opacity-50 blur-[8px]"
            />
        </div>
    );
};

export const PricingPage = ({ page = 'upgrade' }: { page?: 'upgrade' | 'landing' }) => {
    const landingPage = page === 'landing';
    const { t } = useTranslation();
    const router = useRouter();
    const { track } = useRudderstackTrack();
    const [period] = useState<ActiveSubscriptionPeriod>('monthly');
    const [confirmModalData, setConfirmModalData] = useState<SubscriptionConfirmModalData | null>(null);
    const { createSubscription } = useSubscription();

    const prices = usePrices();

    const openConfirmModal = (priceTier: ActiveSubscriptionTier, period: ActiveSubscriptionPeriod, priceId: string) => {
        setConfirmModalData({ priceTier, period, priceId, price: prices[period][priceTier] });
    };

    const options: ActiveSubscriptionTier[] = ['discovery', 'outreach'];

    const handleStartFreeTrialClicked = () => {
        track(LandingPageStartFreeTrialClicked);
        // @note: previously trackEvent(LANDING_PAGE('clicked on start free trial'));
        router.push('/signup');
    };

    return (
        <>
            <ImageBackground />
            <main className="flex flex-grow flex-col">
                <SubscriptionConfirmModal
                    confirmModalData={confirmModalData}
                    setConfirmModalData={setConfirmModalData}
                    createSubscription={createSubscription}
                />

                <div className="container mx-auto flex flex-col items-center">
                    <div className="mx-auto mb-14 max-w-3xl text-center">
                        <h2 className="font-heading mb-6 text-3xl font-semibold text-gray-800 md:text-4xl">
                            {t('pricing.justGettingStartedOrScalingUp')}
                        </h2>
                        <h4 className="-mt-2 text-3xl font-semibold text-primary-500 md:text-4xl">
                            {t('pricing.relayClubCanHelp')}
                        </h4>
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
        </>
    );
};
