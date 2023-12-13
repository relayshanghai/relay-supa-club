import { useTranslation } from 'react-i18next';
import type { PriceDetails } from 'src/hooks/use-prices';
import { priceDetails } from 'src/hooks/use-prices';
import { CheckIcon, CrossIcon, InfoIcon } from '../icons';

/** priceTier can also be 'free' */
export const PriceDetailsCard = ({
    priceTier,
    size = 'large',
}: {
    priceTier: keyof PriceDetails;
    size?: 'small' | 'large';
}) => {
    const { t } = useTranslation();
    return (
        <div>
            {priceDetails[priceTier].map(({ title, icon, info, amount, subtitle }, index) => {
                return (
                    <div
                        key={index}
                        className={`relative mb-2 flex flex-col text-gray-500 ${
                            size === 'small' ? 'text-sm font-semibold' : 'text-sm font-medium'
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
                            {info && (
                                <div className="group absolute right-0 top-1 h-4 w-4 ">
                                    <InfoIcon className="cursor-pointer text-gray-300 duration-300 group-hover:text-gray-600" />

                                    <p className="absolute bottom-full right-0 z-50 hidden w-40 rounded-md bg-white p-5 text-xs shadow-lg duration-300 group-hover:flex">
                                        {t('pricing.' + info)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {subtitle && <div className="py-2 pl-8 text-xs italic ">{t('pricing.' + subtitle)}</div>}
                    </div>
                );
            })}
        </div>
    );
};
