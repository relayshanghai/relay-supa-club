import { useCompany } from 'src/hooks/use-company';
import { useRouter } from 'next/router';
import { useUser } from 'src/hooks/use-user';
import { useTranslation } from 'react-i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SIGNUP_WIZARD } from 'src/utils/rudderstack/event-names';
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
            <h1 className="mb-2 pb-4 text-3xl">Start your free trial now!</h1>
            <ul className="mb-4 pb-4">
                <li>
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
                        2000 Influencer Searches
                    </div>
                </li>
                <li>
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
                        200 Profile Reports
                    </div>
                </li>
                <li>
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
                        Free for 7 days
                    </div>
                </li>
            </ul>
            <button
                onClick={startFreeTrial}
                className="rounded border-2 bg-green-500 px-20 py-3 text-white transition duration-300 hover:border-white hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
                Continue
            </button>

            <div className="pt-20 text-center">
                <button type="button" className="text-sm text-gray-500" onClick={logout}>
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
