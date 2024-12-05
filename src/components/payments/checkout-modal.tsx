import { Modal } from 'src/components/modal';
import { CheckoutDetails } from './checkout-details';
import { type CompanyDB } from 'src/utils/api/db';
import { useCompany } from 'src/hooks/use-company';
import { type FC } from 'react';
import { type ModalProps } from 'app/components/modals';
import awaitToError from 'src/utils/await-to-error';
import { usePayment } from 'src/hooks/use-payment';
import { Button } from '../button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useSubscription } from 'src/hooks/v2/use-subscription';
import { type CheckoutSessionType } from 'types/checkout';
import toast from 'react-hot-toast';
import { PriceType } from 'src/backend/database/plan/plan-entity';

type CheckoutModalProps = {
    currentPriceId: string;
    currentPrice: number;
    planName: string;
} & Pick<ModalProps, 'visible' | 'onClose'>;

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

const ModalContent = ({
    currentPriceId,
    currentPrice,
    planName,
}: {
    currentPriceId: string;
    currentPrice: number;
    planName: string;
}) => {
    const { company } = useCompany();
    const { createCheckoutSession } = usePayment();
    const stripe = useStripe();
    const { defaultPaymentMethod, paymentMethods } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const [, setErrorMessage] = useState('');

    const currentPaymentMethod = paymentMethods?.find((method) => method.id === defaultPaymentMethod);

    const handleError = (error: any) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    };

    const handleCardPayment = async (data: CheckoutSessionType) => {
        if (!stripe) return;
        const { error } = await stripe.confirmPayment({
            clientSecret: data.clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/callbacks`,
            },
        });
        if (error) throw error;
    };

    const handleAlipayPayment = async (data: CheckoutSessionType) => {
        if (!stripe) return;
        const { error } = await stripe.confirmAlipayPayment(data.clientSecret as string, {
            return_url: `${window.location.origin}/checkout/callbacks`,
            mandate_data: {
                customer_acceptance: {
                    type: 'online',
                    online: {
                        ip_address: data.ipAddress,
                        user_agent: window.navigator.userAgent,
                    },
                },
            },
            save_payment_method: false,
        });
        if (error) throw error;
    };

    const handlePayment = async (data: CheckoutSessionType) => {
        setIsLoading(true);

        let err = null;
        const paymentType = currentPaymentMethod?.type;
        if (paymentType === 'card') {
            [err] = await awaitToError(handleCardPayment(data));
        } else if (paymentType === 'alipay') {
            [err] = await awaitToError(handleAlipayPayment(data));
        }

        if (err) {
            handleError(err);
            return;
        }
        setIsLoading(false);
    };

    const doPayment = async () => {
        createCheckoutSession({
            priceId: currentPriceId,
            quantity: 1,
            type: PriceType.PAY_AS_YOU_GO,
        })
            .then((res) =>
                handlePayment({
                    clientSecret: res.clientSecret,
                    ipAddress: res.ipAddress,
                }),
            )
            .then(() => {
                toast.error('Cannot process payment');
            });
    };

    return (
        <>
            <CheckoutDetails
                company={company as CompanyDB}
                currentPrice={currentPrice as number}
                planName={planName as string}
            />
            <Button
                data-testid="pay-button"
                className="mt-10 w-full"
                type="button"
                loading={isLoading}
                onClick={() => doPayment()}
            >
                Pay
            </Button>
        </>
    );
};

export const CheckoutModal: FC<CheckoutModalProps> = ({ visible, onClose, ...props }) => {
    return (
        <Modal visible={visible} onClose={(open) => onClose(open)} maxWidth={`max-w-xl`}>
            <StripeElementsProvider stripe={stripePromise}>
                <ModalContent {...props} />
            </StripeElementsProvider>
        </Modal>
    );
};
