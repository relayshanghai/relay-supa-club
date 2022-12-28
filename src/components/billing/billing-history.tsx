import { useTranslation } from 'react-i18next';

export default function BillingHistory({ history }: { history: any }) {
    const { t } = useTranslation();

    return (
        <div className="mb-4">
            <section aria-labelledby="billing-history-heading">
                <div className="bg-white pt-6 shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 sm:px-6">
                        <h2
                            id="billing-history-heading"
                            className="text-lg leading-6 font-medium text-gray-900"
                        >
                            {t('billing.billingHistory')}
                        </h2>
                    </div>
                    <div className="mt-6 flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="overflow-hidden border-t border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.date')}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.planName')}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.amount')} (USD)
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.profiles')}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.searches')}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.validFrom')}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.validUntil')}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider"
                                                >
                                                    {t('billing.description')}
                                                </th>
                                                {/*
                          `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                        */}
                                                <th
                                                    scope="col"
                                                    className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0"
                                                >
                                                    <span className="sr-only">
                                                        {t('billing.viewReceipt')}
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {history.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <time dateTime={item.paid_at}>
                                                            {
                                                                //@ts-ignore
                                                                dateFormat(item.paid_at)
                                                            }
                                                        </time>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.plan_details.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {
                                                            //@ts-ignore
                                                            toCurrency(item.amount)
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.plan_details.profiles_per_interval ||
                                                            '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.plan_details.searches_per_interval ||
                                                            '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {
                                                            //@ts-ignore
                                                            dateFormat(item.valid_from)
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {
                                                            //@ts-ignore
                                                            dateFormat(item.valid_until)
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.plan_details.description || '-'}
                                                    </td>
                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0">
                            <a href={'#'} className="text-primary-600 hover:text-primary-900">
                              View receipt
                            </a>
                          </td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
