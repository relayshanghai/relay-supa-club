// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const inDev = () => {
    return process.env.NODE_ENV === 'development' || window?.location?.hostname === 'localhost';
};

Sentry.init({
    dsn: SENTRY_DSN || 'https://72058d0ae7d64379b99695eb28fcfdf3@o4504887260676096.ingest.sentry.io/4504887346855936',
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    integrations: [Sentry.replayIntegration({
        // Additional SDK configuration goes in here, for example:
        maskAllText: true,
        blockAllMedia: true,
    })],
    enabled: !inDev(), // turn off in development

    beforeSend(event) {
        if (inDev()) {
            return null;
        } // Check if it is an exception, and if so, show the report dialog
        // if (event.exception) {
        //     Sentry.showReportDialog({ eventId: event.event_id });
        // }
        // turn off user report dialog for now. We can turn back on when we've gotten rid of all the background errors that aren't real errors
        return event;
    },
});
