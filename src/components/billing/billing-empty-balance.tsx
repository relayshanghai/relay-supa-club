import { useTranslation } from 'react-i18next';

export default function EmptyBalance() {
    const { t } = useTranslation();

    return (
        <div className="shadow sm:rounded-md sm:overflow-hidden mb-4">
            <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div>
                    <h2 id="plan-heading" className="text-lg leading-6 font-medium text-gray-900">
                        {t('billing.activePlans')}
                    </h2>
                </div>

                <div>{t('billing.noPlans')}</div>
            </div>
        </div>
    );
}
