import { useTranslation } from 'react-i18next';

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
};

const CrossIcon = () => (
    <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.151 10c0-1.846.635-3.542 1.688-4.897l11.21 11.209A7.948 7.948 0 0110.15 18c-4.41 0-8-3.589-8-8zm16 0a7.954 7.954 0 01-1.688 4.897L5.254 3.688A7.948 7.948 0 0110.151 2c4.411 0 8 3.589 8 8zm-8-10c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z"
            fill="currentColor"
        />
    </svg>
);
const CheckIcon = () => (
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
);
const PlusIcon = () => (
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
);

export const PriceDetailsCard = ({ subscriptionType }: { subscriptionType: 'diy' | 'diyMax' }) => {
    const { t } = useTranslation();
    return (
        <>
            {details[subscriptionType].map(({ title, icon, info }, index) => {
                return (
                    <div
                        key={index}
                        className={`relative mb-2 flex items-center text-gray-600 ${index === 0 ? 'font-bold' : ''}`}
                    >
                        <span
                            className={`mr-2 mt-1 inline-flex flex-shrink-0 items-center justify-center self-start rounded-full ${
                                icon === 'check' ? 'h-4 w-4 bg-green-100 text-green-500' : 'h-4 w-4 text-red-300'
                            }`}
                        >
                            {icon === 'check' && <CheckIcon />}
                            {icon === 'cross' && <CrossIcon />}
                        </span>
                        {t('pricing.' + title)}{' '}
                        {info && (
                            <div className="group absolute right-0 top-1 h-4 w-4 ">
                                <PlusIcon />

                                <p className="absolute bottom-full right-0 z-50 hidden w-40 rounded-md bg-white p-5 text-xs shadow-lg duration-300 group-hover:flex">
                                    {t('pricing.' + info)}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};
