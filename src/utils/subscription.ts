import { SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';

export const isTrial = (status: SubscriptionStatus) => {
    return [SubscriptionStatus.TRIAL, SubscriptionStatus.TRIAL_CANCELLED, SubscriptionStatus.TRIAL_EXPIRED].includes(
        status,
    );
};
