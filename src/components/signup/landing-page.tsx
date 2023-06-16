import Link from 'next/link';
import { LanguageToggle } from '../common/language-toggle';
import { PricingPage } from '../pricing/pricing-page';
import { useTranslation } from 'react-i18next';

export const LandingPage = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-grow flex-col">
            <div className="flex self-end p-5 align-baseline">
                <LanguageToggle />
                <p className="ml-3 font-medium text-gray-500">
                    {t('signup.alreadySignedUp')}
                    <Link href="/login" className="ml-2 text-primary-500">
                        {t('login.logIn')}
                    </Link>
                </p>
            </div>
            <PricingPage page="landing" />;
        </div>
    );
};
