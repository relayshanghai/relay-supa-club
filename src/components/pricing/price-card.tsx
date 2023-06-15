import type { ActiveSubscriptionPeriod, ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { usePrices, PRICE_IDS } from 'src/hooks/use-prices';
import { useSubscription } from 'src/hooks/use-subscription';
import { Button } from '../button';
import { PriceDetailsCard } from './price-details-card';
import type { SubscriptionGetResponse } from 'pages/api/subscriptions';
import { useTranslation } from 'react-i18next';

const isCurrentPlan = (
    tier: ActiveSubscriptionTier,
    period: ActiveSubscriptionPeriod,
    subscription?: SubscriptionGetResponse,
) => {
    const tierName = tier === 'diyMax' ? 'DIY Max' : 'DIY';
    return subscription?.name === tierName && subscription.interval === period && subscription.status === 'active';
};

const disableButton = (
    tier: ActiveSubscriptionTier,
    period: ActiveSubscriptionPeriod,
    subscription?: SubscriptionGetResponse,
) => {
    if (!subscription?.name || !subscription.interval || !subscription.status) {
        return true;
    }
    if (isCurrentPlan(tier, period, subscription)) {
        return true;
    }
    return false;
};

export const PriceCard = ({
    period,
    priceTier,
    openConfirmModal,
    landingPage,
}: {
    period: ActiveSubscriptionPeriod;
    priceTier: ActiveSubscriptionTier;
    openConfirmModal: (plan: ActiveSubscriptionTier, period: ActiveSubscriptionPeriod, priceId: string) => void;
    landingPage: boolean;
}) => {
    const { t } = useTranslation();

    const prices = usePrices();
    const { subscription } = useSubscription();
    const freeTier = priceTier === 'free';

    return (
        <div className="w-full p-4 transition-all ease-in-out hover:-translate-y-3 md:w-1/2 lg:w-1/3">
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-300 p-6">
                <h2 className="title-font mb-1 text-sm font-medium tracking-widest">{t('pricing.' + priceTier)}</h2>
                <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-4xl leading-none text-gray-900">
                    <span data-plan="diy" className="price">
                        {freeTier ? t('pricing.freeTrial') : prices[period][priceTier]}
                    </span>
                    <span className="ml-1 text-lg font-normal text-gray-500">{t('pricing.perMonth')}</span>
                </h1>
                <PriceDetailsCard priceTier={priceTier} />

                {!landingPage && (
                    <Button
                        onClick={() => openConfirmModal(priceTier, period, PRICE_IDS[period][priceTier])}
                        disabled={disableButton(priceTier, period, subscription)}
                        className="flex"
                    >
                        {isCurrentPlan(priceTier, period, subscription)
                            ? t('pricing.yourCurrentPlan')
                            : t('pricing.buyNow')}
                        <svg
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            className="ml-auto h-4 w-4"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Button>
                )}
            </div>
        </div>
    );
};
