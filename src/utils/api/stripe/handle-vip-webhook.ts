import { RELAY_EXPERT_EMAIL } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import {
    getCompanyByCusId,
    supabaseLogger,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
    updateUserRole,
} from 'src/utils/api/db';
import {
    DEFAULT_VIP_AI_EMAILS_LIMIT,
    DEFAULT_VIP_PROFILES_LIMIT,
    DEFAULT_VIP_SEARCHES_LIMIT,
} from 'src/utils/api/stripe/constants';
import { sendEmail } from 'src/utils/send-in-blue-client';
import { supabase } from 'src/utils/supabase-client';
import { unixEpochToISOString } from 'src/utils/utils';
import { ulid } from 'ulid';

import type { NextApiResponse } from 'next';
import type { CustomerSubscriptionCreated } from 'types';
import { serverLogger } from 'src/utils/logger-server';

export const handleVIPSubscription = async (res: NextApiResponse, invoiceBody: CustomerSubscriptionCreated) => {
    const customerId = invoiceBody.data.object.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice body');
    }

    const { data: company, error: companyError } = await getCompanyByCusId(customerId);

    if (companyError) {
        throw companyError;
    }

    const relayExpertPassword = ulid().slice(-8);
    const relayExpertEmail = RELAY_EXPERT_EMAIL;
    // add some randomness to the email to avoid 'email already registered' error
    const email = ulid() + '@relay.club';

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password: relayExpertPassword,
        options: {
            data: {
                first_name: 'Relay',
                last_name: 'Expert',
                company_id: company.id,
            },
        },
    });

    if (signupError) {
        throw signupError;
    }
    if (!signupData.user?.id) {
        throw new Error('Missing user id in signup response');
    }
    await updateUserRole(signupData.user.id, 'relay_expert');

    const price = invoiceBody.data.object.items.data[0].price;
    const { profiles, searches, ai_emails } = price.metadata;
    if (!profiles || !searches || !ai_emails) {
        serverLogger('Missing product metadata: ' + JSON.stringify({ price }));
        throw new Error('Missing product metadata');
    }
    const profiles_limit = price.metadata.profiles || DEFAULT_VIP_PROFILES_LIMIT;
    const searches_limit = price.metadata.searches || DEFAULT_VIP_SEARCHES_LIMIT;
    const ai_limit = price.metadata.ai_emails || DEFAULT_VIP_AI_EMAILS_LIMIT;
    await updateCompanyUsageLimits({
        profiles_limit,
        searches_limit,
        ai_email_generator_limit: ai_limit,
        id: company.id,
    });

    const subscription_start_date = unixEpochToISOString(invoiceBody.data.object.start_date);
    if (!subscription_start_date) {
        throw new Error('Missing subscription start date');
    }

    await updateCompanySubscriptionStatus({
        subscription_status: 'active',
        subscription_start_date,
        subscription_current_period_start: unixEpochToISOString(invoiceBody.data.object.current_period_start),
        subscription_current_period_end: unixEpochToISOString(invoiceBody.data.object.current_period_end),
        id: company.id,
    });
    const html = `
          <p>Hi Relay Expert,</p>
          <p>Here are your login credentials:</p>
          <p>Email: ${email}</p>
          <p>Password: ${relayExpertPassword}</p>
          <p>Start date: ${subscription_start_date}</p>
          <p>Profiles limit: ${profiles_limit}</p>
          <p>Searches limit: ${searches_limit}</p>
              `;
    await sendEmail({
        email: relayExpertEmail,
        name: 'Relay Expert',
        subject: 'Relay Expert Account',
        html,
    });

    supabaseLogger({
        type: 'stripe-webhook',
        message: `Created VIP subscription for company ${company.name} and sent relay expert credentials to ${relayExpertEmail}`,
    });

    return res.status(httpCodes.NO_CONTENT);
};
