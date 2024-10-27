import { useTranslation } from 'react-i18next';
import { PaymentMethodForm } from './payment-method-form';

export const PaymentMethodPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex w-80 justify-center lg:w-[28rem]">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                    {t('account.subscription.addPaymentMethod.title')}
                </h2>
            </div>
            <div className="w-80 rounded shadow lg:w-[28rem]">
                <PaymentMethodForm />
            </div>
        </>
    );
};
