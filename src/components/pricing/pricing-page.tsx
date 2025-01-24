import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useLocalStoragePaymentPeriod,
    type ActiveSubscriptionPeriod,
    type ActiveSubscriptionTier,
} from 'src/hooks/use-prices';
import { PriceCard } from './price-card';
import { screenshots } from 'public/assets/imgs/screenshots';
import Image from 'next/image';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import Link from 'next/link';
import { LanguageToggle } from '../common/language-toggle';
import { ToggleGroup, ToggleGroupItem } from 'shadcn/components/ui/toggle-group';
import { usePricesV2 } from 'src/hooks/v2/use-prices';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/v2/use-subscription';

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
    const { trackEvent } = useRudderstack();
    const { company } = useCompany();
    const { prices, loading: priceLoading } = usePricesV2(company?.currency || 'cny');
    const { subscription } = useSubscription();
    const [paymentPeriod, setPaymentPeriod] = useLocalStoragePaymentPeriod();

    const options: ActiveSubscriptionTier[] = Object.keys(prices ?? {}).filter(
        (d) => d !== 'addPayment',
    ) as ActiveSubscriptionTier[];

    useEffect(() => {
        if (landingPage) {
            setPaymentPeriod({
                ...paymentPeriod,
                period: 'monthly',
            });
            return;
        }
        setPaymentPeriod({
            ...paymentPeriod,
            period: subscription?.interval as ActiveSubscriptionPeriod,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscription?.interval, landingPage]);

    return (
        <>
            <ImageBackground />

            <main className={`flex flex-grow flex-col`}>
                <div className="flex w-full justify-end space-x-3 p-4">
                    <LanguageToggle />

                    {landingPage ? (
                        <p className="ml-3 font-medium text-gray-500">
                            {t('signup.alreadySignedUp')}
                            <Link
                                href="/login"
                                className="text-primary-600"
                                // @note previous name: Landing Page, go to Login Page
                                onClick={() => trackEvent('Go To Login')}
                            >
                                &nbsp; {t('login.logIn')}
                            </Link>
                        </p>
                    ) : (
                        <Link className=" font-semibold text-gray-400" href="/account">
                            {t('pricing.backToAccount')}
                        </Link>
                    )}
                </div>

                <div className="container mx-auto flex flex-col items-center">
                    <div className="mx-auto max-w-3xl pb-10 text-center">
                        <h2 className="font-heading mb-6 text-3xl font-semibold text-gray-800 md:text-4xl">
                            {t('pricing.justGettingStartedOrScalingUp')}
                        </h2>
                        <h4 className="-mt-2 text-3xl font-semibold text-primary-600 md:text-4xl">
                            {t('pricing.relayClubCanHelp')}
                        </h4>
                    </div>
                    <div className="container m-auto flex w-full max-w-screen-xl flex-wrap justify-center">
                        {(!priceLoading || prices) && (
                            <ToggleGroup
                                type="single"
                                value={paymentPeriod.period}
                                onValueChange={(val: ActiveSubscriptionPeriod) => {
                                    if (val)
                                        setPaymentPeriod({
                                            ...paymentPeriod,
                                            period: val,
                                        });
                                }}
                            >
                                <ToggleGroupItem value={'monthly'}>{t('pricing.monthly')}</ToggleGroupItem>
                                <ToggleGroupItem value={'annually'}>{t('pricing.annually')}</ToggleGroupItem>
                            </ToggleGroup>
                        )}
                    </div>
                    <div
                        className={`container m-auto flex ${
                            landingPage ? 'min-h-[20rem] 2xl:min-h-[30rem]' : 'min-h-[32rem]'
                        } w-full max-w-screen-xl flex-wrap justify-center`}
                    >
                        {options.map((option) => (
                            <PriceCard
                                key={option}
                                period={paymentPeriod.period}
                                priceTier={option}
                                landingPage={landingPage}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};
