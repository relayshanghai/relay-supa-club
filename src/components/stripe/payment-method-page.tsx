import { useTranslation } from 'react-i18next';
import { PaymentMethodForm } from './payment-method-form';
import { Tooltip } from '../library';
import { Question } from '../icons';

export const PaymentMethodPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex w-80 justify-center lg:w-[28rem]">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                    {t('account.subscription.addPaymentMethod.title')}
                </h2>
            </div>
            <div className="flex w-80 lg:w-[28rem]">
                <p className="mb-4 font-semibold text-gray-700">{t('pricing.trialExplanationTitle')}</p>
                <Tooltip
                    content={t('pricing.trialExplanationTitle')}
                    detail={t('pricing.trialExplanation')}
                    position="bottom-left"
                    className="ml-1 w-fit"
                >
                    <Question className="h-3/4 w-3/4 stroke-gray-400" />
                </Tooltip>
            </div>
            <div className="w-80 rounded shadow lg:w-[28rem]">
                <PaymentMethodForm />
            </div>
        </>
    );
};
