import type { ActiveSubscriptionPeriod, ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { usePrices, PRICE_IDS } from 'src/hooks/use-prices';
import { useSubscription } from 'src/hooks/use-subscription';
import { Button } from '../button';
import { PriceDetailsCard } from './price-details-card';
import type { SubscriptionGetResponse } from 'pages/api/subscriptions';
import { useTranslation } from 'react-i18next';
import { featNewPricing } from 'src/constants/feature-flags';
import { useRouter } from 'next/router';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { PRICING_PAGE } from 'src/utils/rudderstack/event-names';
import { useCompany } from 'src/hooks/use-company';
import { type CompanyDB } from 'src/utils/api/db';

const isCurrentPlan = (
    tier: ActiveSubscriptionTier,
    period: ActiveSubscriptionPeriod,
    subscription?: SubscriptionGetResponse,
) => {
    const tierName = tier === 'diyMax' ? 'DIY Max' : 'DIY';
    return subscription?.name === tierName && subscription.interval === period && subscription.status === 'active';
};

const allowedCompanyStatus = ['trial', 'canceled', 'awaiting_payment'];

const disableButton = (
    tier: ActiveSubscriptionTier,
    period: ActiveSubscriptionPeriod,
    subscription?: SubscriptionGetResponse,
    company?: CompanyDB,
) => {
    if (!subscription && company && company.subscription_status in allowedCompanyStatus) {
        return false;
    }
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
    const { trackEvent } = useRudderstack();

    const prices = usePrices();
    const { subscription } = useSubscription();
    const { company } = useCompany();
    const freeTier = priceTier === 'free';
    const router = useRouter();

    const handleUpgradeClicked = () => {
        if (featNewPricing()) {
            trackEvent(PRICING_PAGE('clicked on upgrade'), { plan: priceTier });
            router.push(`/payments?plan=${priceTier}`);
        } else {
            openConfirmModal(priceTier, period, PRICE_IDS[period][priceTier]);
        }
    };
    return (
        <div className="w-full  p-4 transition-all ease-in-out hover:-translate-y-3 md:w-1/2 lg:w-1/3">
            <div
                className={`relative flex h-full flex-col overflow-hidden rounded-lg border-2 bg-white ${
                    priceTier === 'diyMax' ? 'border-primary-500' : 'border-gray-300'
                } p-6`}
            >
                <h1 className="relative w-fit text-4xl font-semibold text-gray-800">
                    {t(`pricing.${priceTier}.title`)}
                    <p className="absolute -right-12 top-0 mr-2 text-sm font-semibold text-pink-500">
                        {t('pricing.beta')}
                    </p>
                </h1>
                <h4 className="pt-2 text-xs text-gray-500">{t(`pricing.${priceTier}.subTitle`)}</h4>
                <h1 className="mb-4 mt-4 flex items-center pb-4 text-4xl text-gray-800" data-plan="diy">
                    {prices[period][priceTier]}

                    {!freeTier && (
                        <span className="ml-1 text-sm font-semibold text-gray-500">
                            {featNewPricing() ? t('pricing.rmbPerMonth') : t('pricing.usdPerMonth')}
                        </span>
                    )}
                </h1>
                <PriceDetailsCard priceTier={priceTier} />

                {!landingPage && (
                    <Button
                        onClick={handleUpgradeClicked}
                        disabled={disableButton(priceTier, period, subscription, company)}
                        className="mt-auto"
                    >
                        {isCurrentPlan(priceTier, period, subscription)
                            ? t('pricing.yourCurrentPlan')
                            : t('pricing.upgrade')}
                    </Button>
                )}
            </div>
        </div>
    );
};
