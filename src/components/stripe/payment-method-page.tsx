import { useTranslation } from 'react-i18next';
import { PaymentMethodForm } from './payment-method-form';

export const PaymentMethodPage = () => {
    const { t } = useTranslation();
    return (
        <div className="mb-20">
            <div className="flex w-80 flex-col lg:w-[28rem]">
                <p className="mb-4 text-lg font-semibold text-gray-700">{t('pricing.trialExplanationTitle')}</p>
                <p className="mb-4 text-sm text-gray-700">{t('pricing.trialExplanation')}</p>
            </div>
            <div className="w-80 rounded shadow lg:w-[28rem]">
                <PaymentMethodForm />
            </div>
        </div>
    );
};
