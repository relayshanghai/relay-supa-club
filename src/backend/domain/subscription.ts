import type { Session } from '@supabase/supabase-js';
import { getProfileByIdCall } from 'src/utils/api/db/calls/profiles';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { BadRequestError } from 'src/utils/error/http-error';
import { RequestContext } from 'src/utils/request-context/request-context';
import { db } from 'src/utils/supabase-client';

export default class SubscriptionService {
    static service: SubscriptionService = new SubscriptionService();
    static getService(): SubscriptionService {
        return SubscriptionService.service;
    }
    async upgradeSubscription(priceId: string) {
        const session = RequestContext.getContext().session as Session;
        const { data: manager, error: getManagerError } = await db(getProfileByIdCall)(session.user.id);
        if (!manager?.company?.cus_id) {
            throw getManagerError;
        }
        const cusId = manager.company.cus_id;
        const subscriptions = await stripeClient.subscriptions.list({
            customer: cusId,
        });
        const existedSubscription = subscriptions.data.find((subscription) => subscription.status === 'active');
        if (!existedSubscription) {
            throw new BadRequestError('You are not subscribed to any plan');
        }
        if (existedSubscription.items.data[0].price.id === priceId) {
            throw new BadRequestError('You are already subscribed to this plan');
        }
        // delete existing subscription item
        await stripeClient.subscriptions.update(existedSubscription.id, {
            items: [
                {
                    id: existedSubscription.items.data[0].id,
                    deleted: true,
                },
                { price: priceId },
            ],
            expand: ['latest_invoice.payment_intent'],
            off_session: true,
        });
    }
}
