import type { SubscriptionPortalGetQueries } from 'pages/api/subscriptions/portal';

/** @param id company ID */
export const buildSubscriptionPortalUrl = ({ id, returnUrl }: SubscriptionPortalGetQueries) => {
    const url = new URL('/api/subscriptions/portal', window.location.origin);

    url.searchParams.append('id', id);
    if (returnUrl) url.searchParams.append('returnUrl', returnUrl);

    return url.toString();
};
