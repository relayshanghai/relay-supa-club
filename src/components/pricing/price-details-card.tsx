import { useTranslation } from 'react-i18next';
import { priceDetails, type PriceTiers } from 'src/hooks/use-prices';
import { CheckIcon, CrossIcon, PlusIcon } from '../icons';

/** priceTier can also be 'free' */
export const PriceDetailsCard = ({ priceTier }: { priceTier: keyof PriceTiers }) => {
    const { t } = useTranslation();
    return (
        <div>
            {priceDetails[priceTier].map(({ title, icon, info }, index) => {
                return (
                    <div
                        key={index}
                        className={`relative mb-2 flex items-center text-xs font-semibold text-gray-600 ${
                            index === 0 ? 'font-bold' : ''
                        }`}
                    >
                        <span
                            className={`mr-2 mt-1 inline-flex flex-shrink-0 items-center justify-center self-start rounded-full ${
                                icon === 'check' ? '`h-4 w-4 bg-green-100 text-green-500' : 'h-4 w-4 text-red-300'
                            }`}
                        >
                            {icon === 'check' && <CheckIcon />}
                            {icon === 'cross' && <CrossIcon />}
                        </span>
                        {t('pricing.' + title)}{' '}
                        {info && (
                            <div className="group absolute right-0 top-1 h-4 w-4 ">
                                <PlusIcon />

                                <p className="absolute bottom-full right-0 z-50 hidden w-40 rounded-md bg-white p-5 text-xs shadow-lg duration-300 group-hover:flex">
                                    {t('pricing.' + info)}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
