import { useTranslation } from 'react-i18next';

export const PaymentIntroduction = () => {
    const { t } = useTranslation();
    return (
        <div className="flex h-full w-full max-w-sm flex-col items-center justify-center space-y-8 transition-transform duration-500 ease-in-out lg:max-w-lg xl:max-w-xl 2xl:max-w-3xl">
            <div className="invisible flex h-screen max-h-[870px] flex-col items-center justify-center text-white md:visible">
                <h2 className="mb-6 text-3xl font-bold lg:text-5xl">{t('pricing.trialExplanationTitle')}</h2>
                <p className="text-lg">{t('pricing.trialExplanation')}</p>
            </div>
        </div>
    );
};
