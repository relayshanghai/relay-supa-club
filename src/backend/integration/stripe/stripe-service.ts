import Stripe from 'stripe';

export default class StripeService {
    static service = new StripeService();
    static getService = () => StripeService.service;
    static client = new Stripe(process.env.STRIPE_API_KEY || '', {
        apiVersion: '2022-11-15',
    });

    async createSubscription(cusId: string, priceId: string, quantity = 1) {
        const subscription = await StripeService.client.subscriptions.create({
            customer: cusId,
            items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            payment_settings: {
                payment_method_types: ['card', 'alipay' as any],
            },
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
        return {
            id: subscription.id,
            clientSecret: paymentIntent.client_secret,
        };
    }
}
