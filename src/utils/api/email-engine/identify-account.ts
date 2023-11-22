import { serverLogger } from 'src/utils/logger-server';
import { rudderstack } from 'src/utils/rudderstack';
import { db } from 'src/utils/supabase-client';
import { getProfileByEmailEngineAccountQuery } from '../db/calls/profiles';

// Identity for webhook events that have no `body.account`
const EMAIL_ENGINE_TEST_IDENTITY = 'a579b7c282704275a93aaf0e304335f1302babb91496c6ee3174c8bd3c316601';

/**
 * Set the identity based on the given Email Engine account id
 */
export const identifyAccount = async (account: string) => {
    // @note these webhook calls are probably from tests calls in EE dashboard
    // we will log these calls to Sentry to properly debug in
    // case this happens in a non-test environment
    if (!account) {
        serverLogger('Email Engine webhook has no account');
        return rudderstack.identifyWithAnonymousID(EMAIL_ENGINE_TEST_IDENTITY);
    }

    let profile = null;
    let getProfileByEmailEngineAccountQueryError = '';

    try {
        profile = await db(getProfileByEmailEngineAccountQuery)(account);
    } catch (error: any) {
        getProfileByEmailEngineAccountQueryError = error?.message ?? '';
        serverLogger(error, (scope) => scope.setContext('Email Engine Account', { account }));
    }

    if (profile) {
        rudderstack.identifyWithProfile(profile.id);
    } else {
        rudderstack.identifyWithAnonymousID(account);
    }
    return getProfileByEmailEngineAccountQueryError;
};
