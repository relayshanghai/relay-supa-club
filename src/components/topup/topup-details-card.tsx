import { useTranslation } from 'react-i18next';
import { CheckIcon, CrossIcon } from '../icons';
import type { TopUpSizes } from 'src/hooks/use-topups';
import { topUpBundleDetails } from 'src/hooks/use-topups';

/** priceTier can also be 'free' */
export const TopUpDetailsCard = ({ topUpSize }: { topUpSize: TopUpSizes }) => {
    const { t } = useTranslation();
    return (
        <div>
            {topUpBundleDetails[topUpSize]?.map(({ title, icon, amount }, index) => {
                return (
                    <div
                        key={index}
                        className={`relative mb-2 flex flex-col text-gray-500 ${
                            topUpSize === 'small' ? 'text-sm font-semibold' : 'text-sm font-medium'
                        } ${index === 0 ? 'font-bold' : ''}`}
                    >
                        <div className="flex items-center">
                            <span
                                className={`mr-2 mt-1 inline-flex flex-shrink-0 items-center justify-center self-start rounded-full ${
                                    icon === 'check' ? '`h-4 w-4 bg-green-100 text-green-500' : 'h-4 w-4 text-red-300'
                                }`}
                            >
                                {icon === 'check' && <CheckIcon />}
                                {icon === 'cross' && <CrossIcon />}
                            </span>
                            {t('pricing.' + title, {
                                amount: amount ? new Intl.NumberFormat().format(amount) : '',
                            })}{' '}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
