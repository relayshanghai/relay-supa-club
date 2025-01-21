import CompanyRepository from 'src/backend/database/company/company-repository';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import type Stripe from 'stripe';
import { In, IsNull, Not } from 'typeorm';

export class StripeBackendService {
    public static readonly service: StripeBackendService = new StripeBackendService();

    static getService(): StripeBackendService {
        return StripeBackendService.service;
    }

    async getTrialCustomers() {
        const subs = await StripeService.getService().getTrialSubscriptions();
        const customers = subs.map((sub) => sub.customer as Stripe.Customer);
        const customerIds = customers.map((customer) => customer.id);
        const trialCustomers = await CompanyRepository.getRepository().find({
            where: {
                cusId: In(customerIds),
                profiles: {
                    phone: Not(IsNull()),
                    userRole: 'company_owner',
                },
            },
            relations: {
                profiles: true,
            },
        });

        return trialCustomers;
    }
}
