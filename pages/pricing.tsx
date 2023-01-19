import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from 'src/modules/layout';
import { clientLogger } from 'src/utils/logger';
const details = {
    diy: [
        { title: 'twoHundredNewInfluencerProfilesPerMonth', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates'
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'cross' }
    ],
    diyMax: [
        { title: 'fourHundredFiftyNewInfluencerProfilesPerMonth', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates'
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'cross' }
    ],
    VIP: [
        { title: 'moreInfluencerProfiles', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates'
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'check' }
    ]
};
const prices = {
    monthly: {
        diy: '$150',
        diyMax: '$270',
        VIP: 'Contact us'
    },
    quarterly: {
        diy: '$99',
        diyMax: '$220',
        VIP: 'Contact us'
    },
    annually: {
        diy: '$89',
        diyMax: '$199',
        VIP: 'Contact us'
    }
};

const salesRefEmail = 'amy.hu@relay.club';
const subject = 'relay.club VIP plan subscription';
const body = "Hi, I'm interested in purchasing the VIP plan for my company.";
const VIPEmailLink = `mailto:${salesRefEmail}?${new URLSearchParams({ subject, body })}`;

const unselectedTabClasses = 'py-1 px-4 border-x border-primary-500 cursor-pointer';
const selectedTabClasses = 'py-1 px-4 border-x border-primary-500 bg-primary-500 text-white';

export type Period = 'monthly' | 'annually' | 'quarterly';

/** Note: This file doesn't share a lot of the conventions we have elsewhere across the app, because this file is migrated from the marketing site, trying to make minimal changes in case we need to update both at the same time. */
const Pricing = () => {
    const { t } = useTranslation();

    const [period, setPeriod] = useState<Period>('annually');

    const openConfirmModal = (plan: 'diy' | 'diyMax', period: Period) => {
        clientLogger({ plan, period });
    };

    return (
        <Layout>
            <main className="pt-20 flex-grow">
                <div className="flex flex-col items-center container mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl mt-4 mb-6 font-bold font-heading">
                            {t('pricing.chooseA')}
                            <span className="text-primary-500"> {t('pricing.plan')}</span>
                            {t('pricing.thatWorksBest')}
                        </h2>
                        <p className="text-tertiary-600 leading-wide">{t('pricing.subTitle')}</p>
                    </div>
                    <div className="flex mx-auto rounded-md mb-12 w-fit border-y-2 border-x border-primary-500">
                        <div
                            onClick={() => setPeriod('monthly')}
                            className={
                                period === 'monthly' ? selectedTabClasses : unselectedTabClasses
                            }
                        >
                            {t('pricing.monthly')}
                        </div>
                        <div
                            onClick={() => setPeriod('quarterly')}
                            className={
                                period === 'quarterly' ? selectedTabClasses : unselectedTabClasses
                            }
                        >
                            {t('pricing.quarterly')}
                        </div>
                        <div
                            onClick={() => setPeriod('annually')}
                            className={
                                period === 'annually' ? selectedTabClasses : unselectedTabClasses
                            }
                        >
                            {t('pricing.annually')}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center m-auto container min-h-[32rem] w-full max-w-screen-xl">
                        <div className="p-4 lg:w-1/3 md:w-1/2 w-full hover:-translate-y-3 transition-all ease-in-out">
                            <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
                                <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
                                    {t('pricing.diy')}
                                </h2>
                                <h1 className="text-4xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                                    <span data-plan="diy" className="price">
                                        {prices[period].diy}
                                    </span>
                                    <span className="text-lg ml-1 font-normal text-gray-500">
                                        {t('pricing.perMonth')}
                                    </span>
                                </h1>
                                {details.diy.map(({ title, icon, info }, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`relative flex items-center mb-2 text-gray-600 ${
                                                index === 0 ? 'font-bold' : ''
                                            }`}
                                        >
                                            <span
                                                className={`mr-2 self-start mt-1 inline-flex items-center justify-center rounded-full flex-shrink-0 ${
                                                    icon === 'check'
                                                        ? 'w-4 h-4 bg-gray-400 text-white'
                                                        : 'w-4 h-4 text-red-300'
                                                }`}
                                            >
                                                {icon === 'check' && (
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2.5"
                                                        className="w-3 h-3"
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
                                                <div className="group w-4 h-4 absolute right-0 top-1 ">
                                                    <svg
                                                        className="fill-current text-gray-300 group-hover:text-gray-600 duration-300 cursor-pointer"
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

                                                    <p className="bg-white shadow-lg w-40 hidden group-hover:flex duration-300 absolute right-0 z-50 bottom-full text-xs p-5 rounded-md">
                                                        {t('pricing.' + info)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <a
                                    onClick={() => openConfirmModal('diy', period)}
                                    className="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded"
                                >
                                    {t('pricing.buyNow')}
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        className="w-4 h-4 ml-auto"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="p-4 lg:w-1/3 md:w-1/2 w-full hover:-translate-y-3 transition-all ease-in-out">
                            <div className="h-full p-6 rounded-lg border-2 border-primary-500 flex flex-col relative overflow-hidden">
                                <span className="bg-primary-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">
                                    POPULAR
                                </span>
                                <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
                                    {t('pricing.diyMax')}
                                </h2>
                                <h1 className="text-4xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                                    <span data-plan="diyMax" className="price">
                                        {prices[period].diyMax}
                                    </span>
                                    <span className="text-lg ml-1 font-normal text-gray-500">
                                        {t('pricing.perMonth')}
                                    </span>
                                </h1>
                                {details.diyMax.map(({ title, icon, info }, index) => (
                                    <div
                                        key={index}
                                        className={`relative flex items-center mb-2 text-gray-600 ${
                                            index === 0 ? 'font-bold' : ''
                                        }`}
                                    >
                                        <span
                                            className={`mr-2 self-start mt-1 inline-flex items-center justify-center rounded-full flex-shrink-0 ${
                                                icon === 'check'
                                                    ? 'w-4 h-4 bg-gray-400 text-white'
                                                    : 'w-4 h-4 text-red-300'
                                            }`}
                                        >
                                            {icon === 'check' && (
                                                <svg
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2.5"
                                                    className="w-3 h-3"
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
                                            <div className="group w-4 h-4 absolute right-0 top-1 ">
                                                <svg
                                                    className="fill-current text-gray-300 group-hover:text-gray-600 duration-300 cursor-pointer"
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

                                                <p className="bg-white shadow-lg w-40 hidden group-hover:flex duration-300 absolute right-0 z-50 bottom-full text-xs p-5 rounded-md">
                                                    {t('pricing.' + info)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={() => openConfirmModal('diyMax', period)}
                                    className="flex items-center mt-auto text-white bg-primary-500 border-0 py-2 px-4 w-full focus:outline-none hover:bg-primary-600 rounded"
                                >
                                    {t('pricing.buyNow')}
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        className="w-4 h-4 ml-auto"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 lg:w-1/3 md:w-1/2 w-full hover:-translate-y-3 transition-all ease-in-out">
                            <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
                                <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
                                    {t('pricing.VIP')}
                                </h2>
                                <h1 className="text-4xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                                    <span data-plan="VIP" className="price">
                                        {t('pricing.contactUs')}
                                    </span>
                                </h1>

                                {details.VIP.map(({ title, icon, info }, index) => (
                                    <div
                                        key={index}
                                        className={`relative flex items-center mb-2 text-gray-600 ${
                                            index === 0 ? 'font-bold' : ''
                                        }`}
                                    >
                                        <span
                                            className={`mr-2 self-start mt-1 inline-flex items-center justify-center rounded-full flex-shrink-0 ${
                                                icon === 'check'
                                                    ? 'w-4 h-4 bg-gray-400 text-white'
                                                    : 'w-4 h-4 text-red-300'
                                            }`}
                                        >
                                            {icon === 'check' && (
                                                <svg
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2.5"
                                                    className="w-3 h-3"
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
                                        {t('pricing.' + title)}
                                        {info && (
                                            <div className="group w-4 h-4 absolute right-0 top-1 ">
                                                <svg
                                                    className="fill-current text-gray-300 group-hover:text-gray-600 duration-300 cursor-pointer"
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

                                                <p className="bg-white shadow-lg w-40 hidden group-hover:flex duration-300 absolute right-0 z-50 bottom-full text-xs p-5 rounded-md">
                                                    {t('pricing.' + info)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <a
                                    href={VIPEmailLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded"
                                >
                                    {t('pricing.contactNow')}
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        className="w-4 h-4 ml-auto"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="py-20 mt-20 bg-primary-500 w-full">
                    <div className="container mx-auto px-5">
                        <div className="text-center max-w-xl mx-auto">
                            <h2 className="mb-4 text-3xl text-white font-bold font-heading">
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
