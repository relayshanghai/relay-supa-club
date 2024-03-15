import React from 'react';
import { useSubscription } from 'src/hooks/use-subscription';
import type Stripe from 'stripe';
import { Alipay, MasterCard, Plus, Visa } from '../icons';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'shadcn/components/ui/dialog';
import { Button } from 'shadcn/components/ui/button';

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
            <p className="text-sm font-medium text-gray-700">{details}</p>
            {expiry && <p className="text-sm font-normal text-gray-600">{expiry}</p>}
        </div>
    );
};

const PaymentMethodIcon: React.FC<{ paymentMethod: Stripe.PaymentMethod }> = ({ paymentMethod }) => {
    const brand = paymentMethod.card?.brand ?? 'alipay';
    switch (brand) {
        case 'visa':
            return <Visa className="h-10 w-10" />;
        case 'mastercard':
            return <MasterCard className="h-10 w-10" />;
        case 'alipay':
            return <Alipay className="h-8 w-8 fill-blue-500" />;
        default:
            return <Visa className="h-10 w-10" />;
    }
};

export const BillingDetails = () => {
    const { defaultPaymentMethod, paymentMethods, refreshCustomerInfo, setDefaultPaymentMethod, removePaymentMethod } =
        useSubscription();
    const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
        await setDefaultPaymentMethod(paymentMethodId);
        await refreshCustomerInfo();
    };
    const handleConfirmRemovePaymentMethod = async (paymentMethodId: string) => {
        await removePaymentMethod(paymentMethodId);
        await refreshCustomerInfo();
    };
    return (
        <section id="subscription-details" className="w-full">
            <p className="pb-6 font-semibold">Plan</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <section className="flex w-full flex-col items-end">
                    <div className="flex flex-col space-y-4 rounded-lg bg-white pb-12 lg:w-3/4">
                        {paymentMethods?.map((paymentMethod) => {
                            return (
                                <div
                                    key={paymentMethod.id}
                                    className="flex w-full flex-row items-center justify-between rounded-xl border p-6"
                                >
                                    <section className="flex items-center gap-3">
                                        <PaymentMethodIcon paymentMethod={paymentMethod} />
                                        <PaymentMethodDetails paymentMethod={paymentMethod} />
                                    </section>
                                    {paymentMethod.id === defaultPaymentMethod && (
                                        <p className="h-fit rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-sm font-medium text-blue-500">
                                            Default
                                        </p>
                                    )}
                                    {paymentMethod.id !== defaultPaymentMethod && (
                                        <div className="flex items-center gap-3">
                                            <Dialog>
                                                <DialogTrigger>
                                                    <button className="text-sm font-medium text-red-500 opacity-50">
                                                        Remove
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="flex flex-col items-center">
                                                    <p>Are you sure you want to delete this payment method?</p>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="destructive"
                                                            className="text-sm font-medium text-red-500 hover:bg-red-600 hover:text-white"
                                                            onClick={() =>
                                                                handleConfirmRemovePaymentMethod(paymentMethod.id)
                                                            }
                                                        >
                                                            Yes, remove
                                                        </Button>
                                                        <DialogClose className="text-sm font-medium text-accent-500">
                                                            <Button>Cancel</Button>
                                                        </DialogClose>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            <button
                                                className="text-sm font-medium text-gray-400"
                                                onClick={() => handleSetDefaultPaymentMethod(paymentMethod.id)}
                                            >
                                                Set as default
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <section className="flex items-center gap-3">
                        {/* <Link className="" href="/upgrade">
                            <Button
                                variant="outline"
                                className="border-primary-700 font-semibold text-primary-700 hover:bg-primary-700 hover:text-white"
                            >
                                View payment history
                            </Button>
                        </Link> */}
                        <Button className="w-full bg-blue-200 font-semibold text-blue-500 hover:bg-blue-300">
                            <Plus className="mr-2 h-4 w-4" />
                            Add new payment method
                        </Button>
                    </section>
                </section>
            </section>
        </section>
    );
};
