import React, { useState } from 'react';
import type Stripe from 'stripe';
import { Alipay, MasterCard, Plus, Visa } from '../icons';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'shadcn/components/ui/dialog';
import { Button } from 'shadcn/components/ui/button';
import { AddPaymentMethodModal } from './modal-add-payment-method';
import { Skeleton } from 'shadcn/components/ui/skeleton';
import toast from 'react-hot-toast';
import { type PaymentMethodResponse, useSubscription } from 'src/hooks/v2/use-subscription';
import { useTranslation } from 'react-i18next';

const PaymentMethodInfo: React.FC<{ paymentMethod: Stripe.PaymentMethod }> = ({ paymentMethod }) => {
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

export const PaymentMethodDetails = () => {
    const [newPaymentModalOpenState, setNewPaymentModalOpenState] = useState(false);
    const { t } = useTranslation();
    const {
        defaultPaymentMethod,
        paymentMethods,
        updateDefaultPaymentMethod,
        paymentMethodInfoLoading,
        refreshPaymentMethodInfo,
        removePaymentMethod,
    } = useSubscription();
    const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
        updateDefaultPaymentMethod(paymentMethodId);
        refreshPaymentMethodInfo((prev) => {
            return {
                ...prev,
                defaultPaymentMethod: paymentMethodId,
            } as PaymentMethodResponse;
        });
    };
    const handleConfirmRemovePaymentMethod = async (paymentMethodId: string) => {
        removePaymentMethod(paymentMethodId).then(() => {
            toast.success('Payment method removed');
        });
        refreshPaymentMethodInfo((prev) => {
            return {
                ...prev,
                paymentMethods: prev?.paymentMethods?.filter((pm) => pm.id !== paymentMethodId) || [],
            } as PaymentMethodResponse;
        });
    };

    return (
        <section id="subscription-details" className="w-full">
            <AddPaymentMethodModal open={newPaymentModalOpenState} setOpen={setNewPaymentModalOpenState} />
            <p className="pb-6 font-semibold">{t('account.paymentMethodCard.title')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <section className="flex w-full flex-col items-end">
                    <div className="flex flex-col space-y-4 rounded-lg bg-white pb-12 lg:w-3/4">
                        {paymentMethodInfoLoading && (
                            <div className="flex w-full flex-row items-center justify-between rounded-xl border p-6">
                                <section className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10" />
                                    <Skeleton className="h-10 w-6" />
                                </section>
                                <Skeleton className="h-4 w-14" />
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-24" />
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </div>
                        )}
                        {paymentMethods?.map((paymentMethod) => {
                            return (
                                <div
                                    key={paymentMethod.id}
                                    className="flex w-full flex-row items-center justify-between rounded-xl border p-6"
                                >
                                    <section className="flex items-center gap-3">
                                        <PaymentMethodIcon paymentMethod={paymentMethod} />
                                        <PaymentMethodInfo paymentMethod={paymentMethod} />
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
                                                        <DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                className="text-sm font-medium text-red-500 hover:bg-red-600 hover:text-white"
                                                                onClick={() =>
                                                                    handleConfirmRemovePaymentMethod(paymentMethod.id)
                                                                }
                                                            >
                                                                Yes, remove
                                                            </Button>
                                                        </DialogClose>
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
                        <Button
                            onClick={() => {
                                setNewPaymentModalOpenState(true);
                            }}
                            className="w-full bg-navy-50 font-semibold text-navy-500 hover:bg-navy-100"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('account.paymentMethodCard.addPaymentMethod')}
                        </Button>
                    </section>
                </section>
            </section>
        </section>
    );
};
