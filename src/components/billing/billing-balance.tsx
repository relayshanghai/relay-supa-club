import { useTranslation } from 'react-i18next';
import { paymentPlans } from 'src/constants/paymentPlans';
import dateFormat from 'src/utils/dateFormat';

export default function BillingBalance({ activePlan }: { activePlan: any }) {
    const { t } = useTranslation();

    return (
        <div className="mb-4">
            <section aria-labelledby="plan-heading">
                <form action="#" method="POST">
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                            <div>
                                <h2
                                    id="plan-heading"
                                    className="text-lg leading-6 font-medium text-gray-900"
                                >
                                    {activePlan.type_of}{' '}
                                    {`(${activePlan.purchased_plan.plan_details.name})`}
                                </h2>
                            </div>

                            {paymentPlans.map((plan, index) => (
                                <div className="mb-4" key={index}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">
                                            {t(`billing.${plan.label}`)}
                                        </span>
                                        <span className="px-2 py-1 bg-primary-50 rounded-lg text-xs text-primary-400 font-medium min-w-[46px] text-center">
                                            {activePlan[plan.used] || 0} / {activePlan[plan.max]}
                                        </span>
                                    </div>

                                    <div className="w-full bg-slate-100 h-1 mb-6 mt-2">
                                        <div
                                            className={`bg-primary-400 h-1 rounded`}
                                            style={{
                                                width: `${
                                                    (activePlan[plan.used] / activePlan[plan.max]) *
                                                    100
                                                }%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="text-sm text-gray-600">
                                <div>
                                    {t('billing.validFrom')}:
                                    {
                                        //@ts-ignore
                                        dateFormat(activePlan.valid_from)
                                    }
                                </div>
                                <div>
                                    {t('billing.validUntil')}:{' '}
                                    {
                                        //@ts-ignore
                                        dateFormat(activePlan.valid_until)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}
