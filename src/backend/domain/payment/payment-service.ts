import type { CheckoutRequest } from 'pages/api/payment/checkout/request';
import { PriceType } from 'src/backend/database/plan/plan-entity';
import PlanRepository from 'src/backend/database/plan/plan-repository';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import { RequestContext } from 'src/utils/request-context/request-context';
import { CompanyIdRequired } from '../decorators/company-id';
import { UseLogger } from 'src/backend/integration/logger/decorator';
import type { PaymentCallbackRequest } from 'pages/api/payment/callback/request';
import { NotFoundError, UnprocessableEntityError } from 'src/utils/error/http-error';
import PaymentTransactionRepository from 'src/backend/database/payment-transaction/payment-transaction-repository';
import { IsNull } from 'typeorm';
import TopupCreditRepository from 'src/backend/database/topup-credits/topup-credits-repository';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import BalanceService from '../balance/balance-service';
import awaitToError from 'src/utils/await-to-error';
import CompanyRepository from 'src/backend/database/company/company-repository';
import Stripe from 'stripe';

export default class PaymentService {
    public static readonly service: PaymentService = new PaymentService();
    static getService(): PaymentService {
        return PaymentService.service;
    }

    async checkout(data: CheckoutRequest) {
        const customerId = RequestContext.getContext().customerId as string;
        const companyId = RequestContext.getContext().companyId as string;
        const company = await CompanyRepository.getRepository().getCompanyById(companyId);
        const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card'];
        if (company?.currency === 'cny') {
            paymentMethodTypes.push('alipay');
        }
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        const pi = await StripeService.getService().createPaymentIntent({
            priceId: data.priceId,
            quantity: data.quantity,
            customerId,
            paymentMethodTypes,
        });
        const plan = await PlanRepository.getRepository().findOne({
            where: {
                priceId: data.priceId,
                priceType: PriceType.TOP_UP,
            },
        });
        const paymentTransaction = await PaymentTransactionRepository.getRepository().save({
            company: {
                id: RequestContext.getContext().companyId as string,
            },
            providerTransactionId: pi.id,
            paidAt: null,
        });
        await TopupCreditRepository.getRepository().save({
            company: {
                id: RequestContext.getContext().companyId as string,
            },
            paymentTransaction,
            plan: {
                id: plan?.id,
            },
            expiredAt: subscription?.pausedAt as Date,
        });
        return {
            clientSecret: pi.client_secret,
        };
    }

    @CompanyIdRequired()
    @UseLogger()
    async callback(request: PaymentCallbackRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        if (request.redirectStatus != 'succeeded' && request.redirectStatus != 'pending') {
            throw new UnprocessableEntityError('entity is unprocessable');
        }
        let transaction = await PaymentTransactionRepository.getRepository().findOneBy({
            providerTransactionId: request.paymentIntentId,
            company: {
                id: companyId,
            },
            paidAt: IsNull(),
        });
        if (!transaction) {
            throw new NotFoundError('transaction not found');
        }
        transaction.paidAt = new Date();
        transaction = await PaymentTransactionRepository.getRepository().save(transaction);
        await awaitToError(BalanceService.getService().initBalance({ companyId, force: true }));
        return transaction;
    }
}
