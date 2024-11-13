/* eslint-disable react/self-closing-comp */
import { useCompany } from 'src/hooks/use-company';
import { Button } from '../button';
import TopUpCardSkeleton from './topup-card-skeleton';
import { TopUpDetailsCard } from './topup-details-card';
import { type TopUpPrices, topUpPrices, type TopUpSizes } from 'src/hooks/use-topups';
import { useRouter } from 'next/navigation';

const currencyFormatWithComma = (num: number) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const PriceDetail = ({ price, currency }: { price: TopUpPrices; currency: string }) => {
    return (
        <>
            <h1 className="mb-4 flex items-center pb-4 text-4xl text-gray-800" data-plan="diy">
                {currencyFormatWithComma(price[currency as keyof TopUpPrices])}
                <span className="ml-1 text-sm font-semibold text-gray-500">{currency === 'cny' ? 'RMB' : 'USD'}</span>
            </h1>
        </>
    );
};

export const TopUpCard = ({ topUpSize }: { topUpSize: TopUpSizes }) => {
    const { company } = useCompany();
    const router = useRouter();

    if (false)
        return (
            <div className="mt-4">
                <TopUpCardSkeleton />
            </div>
        );

    const choseButtonClicked = () => {
        router.push('/checkout');
    };

    return (
        <div className="w-full p-4 transition-all ease-in-out hover:-translate-y-3 md:w-1/2 lg:w-1/3">
            <div
                data-testid="price-card-wrapper"
                className="relative flex min-h-full flex-col overflow-hidden rounded-lg border-2 bg-white  p-6"
            >
                <h1 className="relative w-fit text-4xl font-semibold text-gray-800">{topUpSize.toUpperCase()}</h1>
                {/* <h4 className="pt-2 text-xs text-gray-500">{topUpSize}</h4> */}
                <PriceDetail price={topUpPrices[topUpSize]} currency={company?.currency as string} />
                <TopUpDetailsCard topUpSize={topUpSize} />
                <Button
                    onClick={() => choseButtonClicked()}
                    loading={false}
                    className="mt-auto"
                    data-testid="upgrade-button"
                >
                    Choose
                </Button>
            </div>
        </div>
    );
};
