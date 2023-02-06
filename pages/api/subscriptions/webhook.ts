import { NextApiRequest, NextApiResponse } from 'next';
import { RELAY_EXPERT_EMAIL } from 'src/constants/employeeContacts';
import httpCodes from 'src/constants/httpCodes';
import {
    getCompanyByCusId,
    updateCompanySubscriptionStatus,
    updateCompanyUsageLimits,
    updateUserRole,
} from 'src/utils/api/db';
import { STRIPE_PRODUCT_ID_VIP } from 'src/utils/api/stripe/constants';
import { serverLogger } from 'src/utils/logger';
import { sendEmail } from 'src/utils/send-in-blue-client';
import { supabase } from 'src/utils/supabase-client';
import { unixEpochToISOString } from 'src/utils/utils';
import { CustomerSubscriptionCreated } from 'types';

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

                    const relayExpertPassword = Math.random().toString(36).slice(-8);
                    const relayExpertEmail = RELAY_EXPERT_EMAIL;

                    const { data: company, error: companyError } = await getCompanyByCusId(
                        customerId,
                    );
                    if (companyError) {
                        serverLogger(companyError, 'error');
                        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
                    }
                    const { data, error } = await supabase.auth.signUp({
                        email: relayExpertEmail,
                        password: relayExpertPassword,
                        options: {
                            data: {
                                first_name: 'Relay',
                                last_name: 'Expert',
                                company_id: company.id,
                            },
                        },
                    });
                    if (!data.user?.id) {
                        throw new Error('Missing user id in signup response');
                    }
                    await updateUserRole(data.user.id, 'relay_expert');

                    if (error) {
                        serverLogger(error, 'error');
                        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
                    }

                    if (!price.metadata.profiles || !price.metadata.searches) {
                        throw new Error('Missing profiles or searches limit in price metadata');
                    }
                    await updateCompanyUsageLimits({
                        profiles_limit: price.metadata.profiles,
                        searches_limit: price.metadata.searches,
                        id: customerId,
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
                        id: customerId,
                    });

                    await sendEmail({
                        email: relayExpertEmail,
                        name: 'Relay Expert',
                        subject: 'Relay Expert Account',
                        html: `
                        <p>Hi Relay Expert,</p>
                        <p>Here are your login credentials:</p>
                        <p>Email: ${relayExpertEmail}</p>
                        <p>Password: ${relayExpertPassword}</p>
                        <p>Start date: ${subscription_start_date}</p>
                        <p>Profiles limit: ${price.metadata.profiles}</p>
                        <p>Searches limit: ${price.metadata.searches}</p>
                        
`,
                    });
                    return res.status(httpCodes.NO_CONTENT).json({});
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
