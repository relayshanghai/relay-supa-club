import { Dialog, DialogTitle, DialogContent } from 'shadcn/components/ui/dialog';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import { type StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import i18n from 'i18n';
import CheckoutForm from './payment-method-checkout-form';
import toast from 'react-hot-toast';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export const AddPaymentMethodModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const cardOptions: StripeElementsOptions = {
        mode: 'setup',
        paymentMethodCreation: 'manual',
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#8B5CF6', //primary-500 see tailwind.config.js
            },
        },
        locale: i18n.language?.includes('en') ? 'en' : 'zh',
        payment_method_types: ['card', 'alipay'],
    };

    return (
        <div>
            <Dialog
                open={open}
                onOpenChange={(open) => {
                    setOpen(open);
                }}
                aria-labelledby="form-dialog-title"
            >
                <DialogContent>
                    <DialogTitle id="form-dialog-title">Add Payment Method</DialogTitle>
                    <StripeElementsProvider stripe={stripePromise} options={cardOptions}>
                        <CheckoutForm
                            onCompletion={(success: boolean) => {
                                setOpen(false);
                                if (success) {
                                    toast.success('Payment method added successfully');
                                } else {
                                    toast.error('Failed to add payment method');
                                }
                            }}
                        />
                    </StripeElementsProvider>
                </DialogContent>
            </Dialog>
        </div>
    );
};
