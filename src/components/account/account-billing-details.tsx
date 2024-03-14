import React from 'react';
import { useSubscription } from 'src/hooks/use-subscription';
import type Stripe from 'stripe';
import { Alipay, MasterCard, Visa } from '../icons';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'shadcn/components/ui/dialog';

const PaymentMethodDetails: React.FC<{ paymentMethod: Stripe.PaymentMethod }> = ({ paymentMethod }) => {
    let details = 'Unknown';
    let expiry = '';

    if (paymentMethod.type === 'card') {
        const brand = paymentMethod.card?.brand;
        const capitalizedBrand = (brand?.charAt(0)?.toUpperCase() ?? '') + brand?.slice(1);
        details = `${capitalizedBrand} ending in ${paymentMethod.card?.last4}`;
        expiry = `Expires ${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`;
    } else if (paymentMethod.type === 'alipay') {
        details = 'Alipay';
    }

    return (
        <div>
            <p className="text-sm font-semibold">{details}</p>
            {expiry && <p className="text-sm">{expiry}</p>}
        </div>
    );
};

const PaymentMethodIcon: React.FC<{ paymentMethod: Stripe.PaymentMethod }> = ({ paymentMethod }) => {
    const brand = paymentMethod.card?.brand ?? 'alipay';
    switch (brand) {
        case 'visa':
            return <Visa className="h-4 w-4" />;
        case 'mastercard':
            return <MasterCard className="h-4 w-4" />;
        case 'alipay':
            return <Alipay className="h-4 w-4" />;
        default:
            return <Visa className="h-4 w-4" />;
    }
};

export const BillingDetails = () => {
    const {
        defaultPaymentMethod,
        paymentMethods,
        refreshPaymentMethods,
        setDefaultPaymentMethod,
        removePaymentMethod,
    } = useSubscription();
    const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
        await setDefaultPaymentMethod(paymentMethodId);
        await refreshPaymentMethods();
    };
    const handleConfirmRemovePaymentMethod = async (paymentMethodId: string) => {
        await removePaymentMethod(paymentMethodId);
        await refreshPaymentMethods();
    };
    return (
        <section id="subscription-details" className="w-full">
            <p className="pb-6 font-semibold">Plan</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <section className="flex w-full flex-col items-end">
                    <div className="flex flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 pb-12 lg:w-3/4">
                        {paymentMethods?.map((paymentMethod) => {
                            return (
                                <div key={paymentMethod.id} className="flex w-full flex-row justify-between">
                                    <PaymentMethodIcon paymentMethod={paymentMethod} />
                                    <PaymentMethodDetails paymentMethod={paymentMethod} />
                                    {paymentMethod.id === defaultPaymentMethod && (
                                        <p className="text-sm font-semibold text-accent-500">Default</p>
                                    )}
                                    {paymentMethod.id !== defaultPaymentMethod && (
                                        <button
                                            className="text-sm font-semibold text-accent-500"
                                            onClick={() => handleSetDefaultPaymentMethod(paymentMethod.id)}
                                        >
                                            Set as default
                                        </button>
                                    )}

                                    <Dialog>
                                        <DialogTrigger>
                                            <button className="text-sm font-semibold text-accent-500">Remove</button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <p>Are you sure you want to delete this payment method?</p>
                                            <button
                                                className="text-sm font-semibold text-accent-500"
                                                onClick={() => handleConfirmRemovePaymentMethod(paymentMethod.id)}
                                            >
                                                Yes, remove
                                            </button>
                                            <DialogClose className="text-sm font-semibold text-accent-500">
                                                Cancel
                                            </DialogClose>
                                        </DialogContent>
                                    </Dialog>

                                    {/* ... */}
                                </div>
                            );
                        })}
                    </div>
                    {/* <Link className="mt-11" href="/upgrade">
                        <Button
                            className="w-full bg-accent-500 font-semibold text-white hover:bg-accent-300"
                            onClick={() =>
                                // @note previous name: Account, Subscription, click upgrade subscription and go to pricing page
                                trackEvent('Start Upgrade Subscription')
                            }
                        >
                            <Rocket className="mr-2 h-4 w-4 text-white" />
                            {t('account.subscription.upgradeSubscription')}
                        </Button>
                    </Link> */}
                </section>
            </section>
        </section>
    );
};
