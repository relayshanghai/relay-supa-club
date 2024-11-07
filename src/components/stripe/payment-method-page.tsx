import { useTranslation } from 'react-i18next';
import { PaymentMethodForm } from './payment-method-form';
import { ConfirmModal } from 'app/components/confirmation/confirm-modal';
import { useEffect, useState } from 'react';
import { useCompany } from 'src/hooks/use-company';

export const PaymentMethodPage = () => {
    const { t } = useTranslation();
    const { company } = useCompany();
    const [confirmCurrencyModalOpen, setConfirmCurrencyModalOpen] = useState(false);
    useEffect(() => {
        if (company?.currency.toUpperCase() == 'USD') {
            setConfirmCurrencyModalOpen(true);
        }
    }, [company?.currency]);
    return (
        <div className="mb-20">
            <ConfirmModal
                positiveHandler={() => setConfirmCurrencyModalOpen(false)}
                setShow={(show) => setConfirmCurrencyModalOpen(show)}
                show={confirmCurrencyModalOpen}
                title={
                    t('login.usingUsd', {
                        currency: company?.currency.toUpperCase() || 'USD',
                    }) as string
                }
                okButtonText={t('login.yesContinue') as string}
            />
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
