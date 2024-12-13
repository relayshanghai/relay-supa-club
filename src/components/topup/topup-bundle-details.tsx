import { useTranslation } from 'react-i18next';
import { type TopUpSizes } from 'src/hooks/use-topups';
import { TopUpBundleDetailsCard } from './topup-bundle-details-card';

export const TopUpBundleDetails = ({ topUpSize }: { topUpSize: TopUpSizes }) => {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[450px] max-w-sm flex-col rounded-lg border-2 border-gray-300 bg-white p-6">
            <h1 className="relative mt-10 w-fit text-4xl font-semibold text-gray-800">
                {t(`pricing.${topUpSize.toLowerCase() as TopUpSizes}.title`)}
            </h1>
            <p className="text-wrap mt-4 text-xs text-gray-500">
                {t(`pricing.${topUpSize.toLowerCase() as TopUpSizes}.subTitle`)}
            </p>
            <div className="my-3 flex gap-x-5">
                <TopUpBundleDetailsCard topUpSize={topUpSize.toLowerCase() as TopUpSizes} />
            </div>
        </div>
    );
};
