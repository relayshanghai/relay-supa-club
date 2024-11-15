import { CheckoutRequest } from 'pages/api/payment/checkout/request';
import { PriceType, type PlanEntity } from 'src/backend/database/plan/plan-entity';
import PlanRepository from 'src/backend/database/plan/plan-repository';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import { RequestContext } from 'src/utils/request-context/request-context';

export default class PaymentService {
    public static readonly service: PaymentService = new PaymentService();
    static getService(): PaymentService {
        return PaymentService.service;
    }

    async checkout(data: CheckoutRequest) {
        const customerId = RequestContext.getContext().customerId as string;
        const pi = await StripeService.getService().createPaymentIntent({
            priceId: data.priceId,
            quantity: data.quantity,
            customerId,
        });

        return {
            clientSecret: pi.client_secret,
        };
    }
}
