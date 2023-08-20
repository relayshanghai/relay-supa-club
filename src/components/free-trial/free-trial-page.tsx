import { useCompany } from 'src/hooks/use-company';
import { useRouter } from 'next/router';
import { useUser } from 'src/hooks/use-user';
import { useTranslation } from 'react-i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SIGNUP_WIZARD } from 'src/utils/rudderstack/event-names';
import { Button } from '../button';
import Link from 'next/link';

const FreeTrialPage = () => {
    const { t } = useTranslation();
    const { company } = useCompany();
    const router = useRouter();
    const { logout } = useUser();
    const { trackEvent } = useRudderstack();

    const startFreeTrial = async () => {
        const response = await fetch('/api/subscriptions/create-trial-without-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyId: company?.id,
            }),
        });

        await response.json();
        if (response.status === 200) {
            router.push('/dashboard');
        }
    };

    return (
        <div>
            <h1 className="mb-2 pb-12 text-6xl">Start your free trial now</h1>
            <ul className="mb-4 pb-4">
                <li className="pb-3">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="mr-3 h-8 w-8 font-bold text-green-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        BoostBot AI Search: Up to 2,000 Influencer Search Results
                    </div>
                </li>
                <li className="pb-3">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="mr-3 h-8 w-8 font-bold text-green-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        50 Influencer Profile Reports
                    </div>
                </li>
                <li className="pb-3">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="mr-3 h-8 w-8 font-bold text-green-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Search Free for 7 days
                    </div>
                </li>
                <li className="pb-3">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="mr-3 h-8 w-8 font-bold text-green-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                            />
                        </svg>
                        Upgrade to &quot;Outreach Plan&quot; and start emailing influencers today!
                    </div>
                </li>
            </ul>
            <Button
                onClick={startFreeTrial}
                className="w-full rounded border-2 px-40 py-3 text-white transition duration-300 hover:border-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
                Start free trial
            </Button>

            <div className="pt-20 text-center">
                <button type="button" className="ml-2 px-1 pb-1 pt-1 text-xs" onClick={logout}>
                    {t('login.stuckHereTryAgain1')}
                    <Link
                        className="text-primary-500"
                        href="/logout"
                        onClick={() => trackEvent(SIGNUP_WIZARD('step-5, log out'))}
                    >
                        {t('login.signOut')}
                    </Link>
                    {t('login.stuckHereTryAgain2')}
                </button>
            </div>
        </div>
    );
};

export default FreeTrialPage;
