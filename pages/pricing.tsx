import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionConfirmModalData } from 'src/components/account/subscription-confirm-modal';
import { SubscriptionConfirmModal } from 'src/components/account/subscription-confirm-modal';
import { Button } from 'src/components/button';
import { SALES_REP_EMAIL } from 'src/constants/employeeContacts';
import { useSubscription } from 'src/hooks/use-subscription';
import { Layout } from 'src/components/layout';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { SubscriptionPeriod } from 'types';
import type { SubscriptionPricesGetResponse } from './api/subscriptions/prices';
const details = {
    diy: [
        { title: 'twoHundredNewInfluencerProfilesPerMonth', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates',
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'cross' },
    ],
    diyMax: [
        { title: 'fourHundredFiftyNewInfluencerProfilesPerMonth', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates',
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'cross' },
    ],
    VIP: [
        { title: 'moreInfluencerProfiles', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates',
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'check' },
    ],
};

const subject = 'relay.club VIP plan subscription';
const body = "Hi, I'm interested in purchasing the VIP plan for my company.";
const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
const VIPEmailLink = `mailto:${SALES_REP_EMAIL}?${query}`;

const unselectedTabClasses = 'py-1 px-4 border-x border-primary-500 cursor-pointer';
const selectedTabClasses = 'py-1 px-4 border-x border-primary-500 bg-primary-500 text-white';

type PriceTiers = {
    diy: string;
    diyMax: string;
    VIP: string;
};
type Prices = {
    monthly: PriceTiers;
    quarterly: PriceTiers;
    annually: PriceTiers;
};

const formatPrice = (price: string, currency: string, period: 'monthly' | 'annually' | 'quarterly') => {
    const pricePerMonth =
        period === 'annually' ? Number(price) / 12 : period === 'quarterly' ? Number(price) / 3 : Number(price);
    /** I think rounding to the dollar is OK for now, but if need be we can add cents */
    const roundedPrice = Math.round(pricePerMonth);
    if (currency === 'usd')
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(roundedPrice);
    // not sure what other currencies we will handle and if we can pass them directly to Intl.NumberFormat so this is a placeholder until we know
    return `${roundedPrice} ${currency}`;
};

/** Note: This file doesn't share a lot of the conventions we have elsewhere across the app, because this file is migrated from the marketing site, trying to make minimal changes in case we need to update both at the same time. */
const Pricing = () => {
    const { t } = useTranslation();
    const { subscription, createSubscription } = useSubscription();
    const [period, setPeriod] = useState<SubscriptionPeriod>('annually');
    const [confirmModalData, setConfirmModalData] = useState<SubscriptionConfirmModalData | null>(null);
    const [priceIds, setPriceIds] = useState<{
        diy: { monthly: string; quarterly: string; annually: string };
        diyMax: { monthly: string; quarterly: string; annually: string };
    } | null>(null);

    const openConfirmModal = (plan: 'diy' | 'diyMax', period: SubscriptionPeriod, priceId: string) => {
        setConfirmModalData({ plan, period, priceId, price: prices[period][plan] });
    };

    const [prices, setPrices] = useState<Prices>({
        monthly: {
            diy: '--',
            diyMax: '--',
            VIP: t('pricing.contactUs'),
        },
        quarterly: {
            diy: '--',
            diyMax: '--',
            VIP: t('pricing.contactUs'),
        },
        annually: {
            diy: '--',
            diyMax: '--',
            VIP: t('pricing.contactUs'),
        },
    });

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await nextFetch<SubscriptionPricesGetResponse>('subscriptions/prices');
                const { diy, diyMax } = res;

                const monthly = {
                    diy: formatPrice(diy.prices.monthly, diy.currency, 'monthly'),
                    diyMax: formatPrice(diyMax.prices.monthly, diyMax.currency, 'monthly'),
                    VIP: t('pricing.contactUs'),
                };
                const quarterly = {
                    diy: formatPrice(diy.prices.quarterly, diy.currency, 'quarterly'),
                    diyMax: formatPrice(diyMax.prices.quarterly, diyMax.currency, 'quarterly'),
                    VIP: t('pricing.contactUs'),
                };
                const annually = {
                    diy: formatPrice(diy.prices.annually, diy.currency, 'annually'),
                    diyMax: formatPrice(diyMax.prices.annually, diyMax.currency, 'annually'),
                    VIP: t('pricing.contactUs'),
                };

                setPrices({ monthly, quarterly, annually });
                setPriceIds({ diy: diy.priceIds, diyMax: diyMax.priceIds });
            } catch (error) {
                clientLogger(error, 'error', true); // send to sentry cause there's something wrong with the pricing endpoint
            }
        };

        fetchPrices();
    }, [t]);

    const isCurrentPlan = (plan: 'diy' | 'diyMax') => {
        const planName = plan === 'diyMax' ? 'DIY Max' : 'DIY';
        return subscription?.name === planName && subscription.interval === period && subscription.status === 'active';
    };

    const disableButton = (plan: 'diy' | 'diyMax') => {
        if (!priceIds || !subscription?.name || !subscription.interval || !subscription.status) {
            return true;
        }
        if (isCurrentPlan(plan)) {
            return true;
        }
        return false;
    };

    return (
        <Layout>
            <SubscriptionConfirmModal
                confirmModalData={confirmModalData}
                setConfirmModalData={setConfirmModalData}
                createSubscription={createSubscription}
            />
            <main className="flex-grow pt-20">
                <div className="container mx-auto flex flex-col items-center">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="font-heading mt-4 mb-6 text-3xl font-bold md:text-4xl">
                            {t('pricing.chooseA')}
                            <span className="text-primary-500"> {t('pricing.plan')}</span>
                            {t('pricing.thatWorksBest')}
                        </h2>
                        <p className="leading-wide text-tertiary-600">{t('pricing.subTitle')}</p>
                    </div>
                    <div className="mx-auto mb-12 flex w-fit rounded-md border-y-2 border-x border-primary-500">
                        <div
                            onClick={() => setPeriod('monthly')}
                            className={period === 'monthly' ? selectedTabClasses : unselectedTabClasses}
                        >
                            {t('pricing.monthly')}
                        </div>
                        <div
                            onClick={() => setPeriod('quarterly')}
                            className={period === 'quarterly' ? selectedTabClasses : unselectedTabClasses}
                        >
                            {t('pricing.quarterly')}
                        </div>
                        <div
                            onClick={() => setPeriod('annually')}
                            className={period === 'annually' ? selectedTabClasses : unselectedTabClasses}
                        >
                            {t('pricing.annually')}
                        </div>
                    </div>
                    <div className="container m-auto flex min-h-[32rem] w-full max-w-screen-xl flex-wrap justify-center">
                        <div className="w-full p-4 transition-all ease-in-out hover:-translate-y-3 md:w-1/2 lg:w-1/3">
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-300 p-6">
                                <h2 className="title-font mb-1 text-sm font-medium tracking-widest">
                                    {t('pricing.diy')}
                                </h2>
                                <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-4xl leading-none text-gray-900">
                                    <span data-plan="diy" className="price">
                                        {prices[period].diy}
                                    </span>
                                    <span className="ml-1 text-lg font-normal text-gray-500">
                                        {t('pricing.perMonth')}
                                    </span>
                                </h1>
                                {details.diy.map(({ title, icon, info }, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`relative mb-2 flex items-center text-gray-600 ${
                                                index === 0 ? 'font-bold' : ''
                                            }`}
                                        >
                                            <span
                                                className={`mr-2 mt-1 inline-flex flex-shrink-0 items-center justify-center self-start rounded-full ${
                                                    icon === 'check'
                                                        ? 'h-4 w-4 bg-gray-400 text-white'
                                                        : 'h-4 w-4 text-red-300'
                                                }`}
                                            >
                                                {icon === 'check' && (
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2.5"
                                                        className="h-3 w-3"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                )}
                                                {icon === 'cross' && (
                                                    <svg
                                                        viewBox="0 0 21 20"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M2.151 10c0-1.846.635-3.542 1.688-4.897l11.21 11.209A7.948 7.948 0 0110.15 18c-4.41 0-8-3.589-8-8zm16 0a7.954 7.954 0 01-1.688 4.897L5.254 3.688A7.948 7.948 0 0110.151 2c4.411 0 8 3.589 8 8zm-8-10c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            {t('pricing.' + title)}{' '}
                                            {info && (
                                                <div className="group absolute right-0 top-1 h-4 w-4 ">
                                                    <svg
                                                        className="cursor-pointer fill-current text-gray-300 duration-300 group-hover:text-gray-600"
                                                        viewBox="0 0 21 20"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M10.151 7a1 1 0 11.001-2 1 1 0 010 2zm1 7a1 1 0 01-2 0V9a1 1 0 012 0v5zm-1-14c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.522 0 10-4.477 10-10s-4.478-10-10-10z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>

                                                    <p className="absolute right-0 bottom-full z-50 hidden w-40 rounded-md bg-white p-5 text-xs shadow-lg duration-300 group-hover:flex">
                                                        {t('pricing.' + info)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <Button
                                    onClick={() =>
                                        openConfirmModal('diy', period, priceIds ? priceIds['diy'][period] : '')
                                    }
                                    disabled={disableButton('diy')}
                                    className="flex"
                                >
                                    {isCurrentPlan('diy') ? t('pricing.yourCurrentPlan') : t('pricing.buyNow')}
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
                            </div>
                        </div>
                        <div className="w-full p-4 transition-all ease-in-out hover:-translate-y-3 md:w-1/2 lg:w-1/3">
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-primary-500 p-6">
                                <span className="absolute right-0 top-0 rounded-bl bg-primary-500 px-3 py-1 text-xs tracking-widest text-white">
                                    {t('pricing.popular')}
                                </span>
                                <h2 className="title-font mb-1 text-sm font-medium tracking-widest">
                                    {t('pricing.diyMax')}
                                </h2>
                                <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-4xl leading-none text-gray-900">
                                    <span data-plan="diyMax" className="price">
                                        {prices[period].diyMax}
                                    </span>
                                    <span className="ml-1 text-lg font-normal text-gray-500">
                                        {t('pricing.perMonth')}
                                    </span>
                                </h1>
                                {details.diyMax.map(({ title, icon, info }, index) => (
                                    <div
                                        key={index}
                                        className={`relative mb-2 flex items-center text-gray-600 ${
                                            index === 0 ? 'font-bold' : ''
                                        }`}
                                    >
                                        <span
                                            className={`mr-2 mt-1 inline-flex flex-shrink-0 items-center justify-center self-start rounded-full ${
                                                icon === 'check'
                                                    ? 'h-4 w-4 bg-gray-400 text-white'
                                                    : 'h-4 w-4 text-red-300'
                                            }`}
                                        >
                                            {icon === 'check' && (
                                                <svg
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2.5"
                                                    className="h-3 w-3"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            )}
                                            {icon === 'cross' && (
                                                <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M2.151 10c0-1.846.635-3.542 1.688-4.897l11.21 11.209A7.948 7.948 0 0110.15 18c-4.41 0-8-3.589-8-8zm16 0a7.954 7.954 0 01-1.688 4.897L5.254 3.688A7.948 7.948 0 0110.151 2c4.411 0 8 3.589 8 8zm-8-10c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        {t('pricing.' + title)}{' '}
                                        {info && (
                                            <div className="group absolute right-0 top-1 h-4 w-4 ">
                                                <svg
                                                    className="cursor-pointer fill-current text-gray-300 duration-300 group-hover:text-gray-600"
                                                    viewBox="0 0 21 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M10.151 7a1 1 0 11.001-2 1 1 0 010 2zm1 7a1 1 0 01-2 0V9a1 1 0 012 0v5zm-1-14c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.522 0 10-4.477 10-10s-4.478-10-10-10z"
                                                        fill="currentColor"
                                                    />
                                                </svg>

                                                <p className="absolute right-0 bottom-full z-50 hidden w-40 rounded-md bg-white p-5 text-xs shadow-lg duration-300 group-hover:flex">
                                                    {t('pricing.' + info)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    onClick={() =>
                                        openConfirmModal('diyMax', period, priceIds ? priceIds['diyMax'][period] : '')
                                    }
                                    disabled={disableButton('diyMax')}
                                    className="flex"
                                >
                                    {isCurrentPlan('diyMax') ? t('pricing.yourCurrentPlan') : t('pricing.buyNow')}
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
                            </div>
                        </div>
                        <div className="w-full p-4 transition-all ease-in-out hover:-translate-y-3 md:w-1/2 lg:w-1/3">
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-300 p-6">
                                <h2 className="title-font mb-1 text-sm font-medium tracking-widest">
                                    {t('pricing.VIP')}
                                </h2>
                                <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-4xl leading-none text-gray-900">
                                    <span data-plan="VIP" className="price">
                                        {t('pricing.contactUs')}
                                    </span>
                                </h1>

                                {details.VIP.map(({ title, icon, info }, index) => (
                                    <div
                                        key={index}
                                        className={`relative mb-2 flex items-center text-gray-600 ${
                                            index === 0 ? 'font-bold' : ''
                                        }`}
                                    >
                                        <span
                                            className={`mr-2 mt-1 inline-flex flex-shrink-0 items-center justify-center self-start rounded-full ${
                                                icon === 'check'
                                                    ? 'h-4 w-4 bg-gray-400 text-white'
                                                    : 'h-4 w-4 text-red-300'
                                            }`}
                                        >
                                            {icon === 'check' && (
                                                <svg
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2.5"
                                                    className="h-3 w-3"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            )}
                                            {icon === 'cross' && (
                                                <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M2.151 10c0-1.846.635-3.542 1.688-4.897l11.21 11.209A7.948 7.948 0 0110.15 18c-4.41 0-8-3.589-8-8zm16 0a7.954 7.954 0 01-1.688 4.897L5.254 3.688A7.948 7.948 0 0110.151 2c4.411 0 8 3.589 8 8zm-8-10c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        {t('pricing.' + title)}
                                        {info && (
                                            <div className="group absolute right-0 top-1 h-4 w-4 ">
                                                <svg
                                                    className="cursor-pointer fill-current text-gray-300 duration-300 group-hover:text-gray-600"
                                                    viewBox="0 0 21 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M10.151 7a1 1 0 11.001-2 1 1 0 010 2zm1 7a1 1 0 01-2 0V9a1 1 0 012 0v5zm-1-14c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.522 0 10-4.477 10-10s-4.478-10-10-10z"
                                                        fill="currentColor"
                                                    />
                                                </svg>

                                                <p className="absolute right-0 bottom-full z-50 hidden w-40 rounded-md bg-white p-5 text-xs shadow-lg duration-300 group-hover:flex">
                                                    {t('pricing.' + info)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <a href={VIPEmailLink} target="_blank" rel="noreferrer" className="mt-auto">
                                    <Button className="flex w-full">
                                        {t('pricing.contactNow')}
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
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="mt-20 w-full bg-primary-500 py-20">
                    <div className="container mx-auto px-5">
                        <div className="mx-auto max-w-xl text-center">
                            <h2 className="font-heading mb-4 text-3xl font-bold text-white">
                                <span>{t('pricing.checkOutOur')}</span>
                                <a className="text-primary-300" href="https://relay.club/blog">
                                    {t('pricing.blog')}
                                </a>
                                <br />
                                <span>{t('pricing.andLearnHowToGetTheMost')}</span>
                            </h2>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
};

export default Pricing;
