import Link from 'next/link';
import { LanguageToggle } from '../common/language-toggle';
import { PricingPage } from '../pricing/pricing-page';
import { useTranslation } from 'react-i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';

export const LandingPage = () => {
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    return (
        <div className="flex flex-col">
            <div className="absolute right-0 top-0 flex self-end p-5 align-baseline">
                <LanguageToggle />
                <p className="ml-3 font-medium text-gray-500">
                    {t('signup.alreadySignedUp')}
                    <Link
                        href="/login"
                        className="text-primary-500"
                        // @note previous name: Landing Page, go to Login Page
                        onClick={() => trackEvent('Go To Login')}
                    >
                        &nbsp; {t('login.logIn')}
                    </Link>
                </p>
            </div>
            <div className="pt-10">
                <PricingPage page="landing" />
            </div>
        </div>
    );
};
