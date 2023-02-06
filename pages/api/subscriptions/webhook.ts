import { NextApiRequest, NextApiResponse } from 'next';
import { RELAY_EXPERT_EMAIL } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import {
    getCompanyByCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
    updateUserRole,
} from 'src/utils/api/db';
import {
    DEFAULT_VIP_PROFILES_LIMIT,
    DEFAULT_VIP_SEARCHES_LIMIT,
    STRIPE_PRODUCT_ID_VIP,
} from 'src/utils/api/stripe/constants';
import { serverLogger } from 'src/utils/logger';
import { sendEmail } from 'src/utils/send-in-blue-client';
import { supabase } from 'src/utils/supabase-client';
import { unixEpochToISOString } from 'src/utils/utils';
import { CustomerSubscriptionCreated } from 'types';
import { ulid } from 'ulid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) return res.status(httpCodes.BAD_REQUEST).json({});

            // TODO task V2-26o: test in production (Staging) if the webhook is actually called after trial ends.

            const body = req.body;
            if (body.type === 'customer.subscription.created') {
                const invoiceBody = body as CustomerSubscriptionCreated;
                const price = invoiceBody.data.object.items.data[0].price;
                const productID = price.product;
                if (productID === STRIPE_PRODUCT_ID_VIP) {
                    const customerId = invoiceBody.data.object.customer;
                    if (!customerId) {
                        throw new Error('Missing customer ID in invoice body');
                    }

                    const { data: company, error: companyError } = await getCompanyByCusId(
                        customerId,
                    );
                    if (companyError) {
                        serverLogger(companyError, 'error');
                        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
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
                        serverLogger(signupError, 'error');
                        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
                    }
                    if (!signupData.user?.id) {
                        throw new Error('Missing user id in signup response');
                    }
                    await updateUserRole(signupData.user.id, 'relay_expert');

                    const profiles_limit = price.metadata.profiles || DEFAULT_VIP_PROFILES_LIMIT;
                    const searches_limit = price.metadata.searches || DEFAULT_VIP_SEARCHES_LIMIT;
                    await updateCompanyUsageLimits({
                        profiles_limit,
                        searches_limit,
                        id: company.id,
                    });

                    const subscription_start_date = unixEpochToISOString(
                        invoiceBody.data.object.start_date,
                    );
                    if (!subscription_start_date) {
                        throw new Error('Missing subscription start date');
                    }

                    await updateCompanySubscriptionStatus({
                        subscription_status: 'active',
                        subscription_start_date,
                        subscription_current_period_start: unixEpochToISOString(
                            invoiceBody.data.object.current_period_start,
                        ),
                        subscription_current_period_end: unixEpochToISOString(
                            invoiceBody.data.object.current_period_end,
                        ),
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
                    return res.status(httpCodes.NO_CONTENT);
                } else {
                    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
                }
            } else {
                return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
            }
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
