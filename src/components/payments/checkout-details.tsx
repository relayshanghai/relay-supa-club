import { type FC } from 'react';

type CheckoutDetailsProps = {
    planName: string;
    currentPrice: number;
    company: {
        currency: string;
    };
};

export const CheckoutDetails: FC<CheckoutDetailsProps> = ({ company, currentPrice, planName }) => {
    return (
        <>
            {/* Your order text */}
            <div className="border-b bg-white p-4">
                <h2 className="text-lg font-bold text-gray-800">Your order</h2>
            </div>
            {/* line */}
            <div className="border-b bg-white p-4">
                <div className="flex justify-between">
                    <span className="flex w-52 space-x-1">
                        <strong>{planName}</strong>
                        <p className="text-gray-800" />
                    </span>
                    <p className="text-gray-800">
                        {currentPrice} {company?.currency.toUpperCase()}
                    </p>
                </div>
            </div>
            <div className="border-b bg-white p-4">
                <div className="flex justify-between">
                    <p className="text-xl font-semibold text-gray-800">Total</p>
                    <p className="text-xl font-semibold text-gray-800">
                        {currentPrice} {company?.currency.toUpperCase()}
                    </p>
                </div>
            </div>
        </>
    );
};
