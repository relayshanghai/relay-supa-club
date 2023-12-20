import type { NextApiRequest, NextApiResponse } from 'next';
import { LEGACY_RELAY_DOMAIN, emailRegex } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { createCompanyErrors } from 'src/errors/company';
import { ApiHandler } from 'src/utils/api-handler';
import type { CompanyDB, ProfileDB, RelayDatabase } from 'src/utils/api/db';
import { deleteCompanyById, findCompaniesByName, insertProfileWithRole } from 'src/utils/api/db';
import { createCompany } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger-server';
import { db } from 'src/utils/supabase-client';
import { z } from 'zod';
import { addCompanyCategory } from 'src/utils/api/db/calls/company-categories';
import { RelayError } from 'src/errors/relay-error';
import { createContact } from 'src/utils/api/brevo';
import type { ProfileInsertBody } from './profiles';
import { v4 } from 'uuid';
import type Stripe from 'stripe';
import { DISCOVERY_PLAN } from 'src/utils/api/stripe/constants';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { unixEpochToISOString } from 'src/utils/utils';
import { deleteUserById } from 'src/utils/api/db/calls/profiles';

/** Brevo List ID of the newly signed up trial users that will be funneled to an marketing automation */
const BREVO_NEWTRIALUSERS_LIST_ID = process.env.BREVO_NEWTRIALUSERS_LIST_ID ?? null;

const SignupPostBody = z.object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().optional(),
    companyName: z.string(),
    companyWebsite: z.string().optional(),
    category: z.string().optional(),
});

export type SignupPostBody = z.input<typeof SignupPostBody>;

export type SignupPostResponse = CompanyDB;

const validateAndParseData = (req: NextApiRequest) => {
    const validated = SignupPostBody.safeParse(req.body);

    if (!validated.success) {
        throw new Error(`${validated.error.format()}`);
    }

    const { companyName: untrimmedName, ...body } = validated.data;

    const companyName = untrimmedName.trim();

    return { companyName, ...body };
};

const validateCompanyName = async ({ companyName }: { companyName: string }) => {
    // Do not allow users to create a company with our reserved name for internal employees
    if (companyName.toLowerCase() === LEGACY_RELAY_DOMAIN.toLowerCase()) {
        throw new RelayError('reserved name', httpCodes.BAD_REQUEST);
    }
    let companies = [];
    try {
        companies = await db(findCompaniesByName)(companyName);
    } catch (error) {
        serverLogger(error);
    }

    if (companies.length > 0) {
        throw new RelayError(createCompanyErrors.companyWithSameNameExists, httpCodes.BAD_REQUEST);
    }
};

const createProfile = async ({
    userId,
    email,
    firstName,
    lastName,
    phoneNumber,
    companyId,
}: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    companyId: string;
}) =>
    db(insertProfileWithRole)({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phoneNumber,
        user_role: 'company_owner',
        company_id: companyId,
    });

const createSupabaseUser = async ({ email, password }: { email: string; password: string }) => {
    const { error, data } = await db(
        (supabaseClient: RelayDatabase) => () =>
            supabaseClient.auth.signUp({
                email,
                password,
            }),
    )();
    if (error) {
        throw error.message;
    }
    const userId = data?.user?.id || data.session?.user.id;
    if (!userId) {
        throw new Error(createCompanyErrors.failedToSignUp);
    }
    return userId;
};

const createStripeCustomerAndSubscription = async ({
    companyName,
    companyId,
    email,
}: {
    companyName: string;
    companyId: string;
    email: string;
}) => {
    const customer = await stripeClient.customers.create({
        name: companyName,
        email,
        metadata: {
            company_id: companyId,
        },
    });

    if (!customer || !customer.id) {
        throw new Error(createCompanyErrors.unableToMakeStripeCustomer);
    }

    const { trial_days, priceId } = DISCOVERY_PLAN;

    const createParams: Stripe.SubscriptionCreateParams = {
        customer: customer.id,
        items: [{ price: priceId }],
        proration_behavior: 'create_prorations',
        trial_period_days: Number(trial_days),
        trial_settings: {
            end_behavior: {
                missing_payment_method: 'pause',
            },
        },
    };

    const subscription = await stripeClient.subscriptions.create(createParams);

    if (!subscription || subscription.status !== 'trialing') {
        throw new Error(createSubscriptionErrors.unableToActivateSubscription);
    }

    return { cus_id: customer.id, subscription };
};

const createCompanyWithSubscriptionLimits = async ({
    subscription,
    companyId,
    companyName,
    companyWebsite,
    cus_id,
}: {
    subscription: Stripe.Subscription;
    companyId: string;
    companyName: string;
    companyWebsite?: string;
    cus_id: string;
}) => {
    const { searches, profiles, ai_emails, trial_searches, trial_profiles, trial_ai_emails } = DISCOVERY_PLAN;

    return await db(createCompany)({
        id: companyId,
        name: companyName,
        website: companyWebsite,
        cus_id,
        terms_accepted: true,
        profiles_limit: profiles,
        searches_limit: searches,
        ai_email_generator_limit: ai_emails,
        trial_profiles_limit: trial_profiles,
        trial_searches_limit: trial_searches,
        trial_ai_email_generator_limit: trial_ai_emails,
        subscription_status: 'trial',
        subscription_start_date: unixEpochToISOString(subscription.trial_start, subscription.start_date),
        subscription_current_period_start: unixEpochToISOString(subscription.current_period_start),
        subscription_current_period_end: unixEpochToISOString(subscription.current_period_end),
        subscription_plan: 'Discovery',
    });
};

/** has it's own try catch so won't effect user's company creation */
const createBrevoContact = async (profile: ProfileDB, company: CompanyDB) => {
    if (!profile.email || !company.name || !BREVO_NEWTRIALUSERS_LIST_ID) {
        return false;
    }

    try {
        return await createContact({
            email: profile.email,
            attributes: {
                FIRSTNAME: profile.first_name,
                LASTNAME: profile.last_name,
                COMPANYNAME: company.name,
            },
            listIds: [Number(BREVO_NEWTRIALUSERS_LIST_ID)],
        });
    } catch (error) {
        serverLogger(error, (scope) => {
            return scope.setContext('Error', {
                error: 'Cannot create brevo contact',
                email: profile.email,
                listId: BREVO_NEWTRIALUSERS_LIST_ID,
            });
        });
        return false;
    }
};

/** has it's own try catch so won't effect user's company creation */
const createServiceAccount = async (company: CompanyDB) => {
    try {
        const password = process.env.SERVICE_ACCOUNT_PASSWORD ?? 'password123!';

        const email = `support+${company.cus_id?.toLowerCase().trim()}@boostbot.ai`;
        const emailCheck = emailRegex.test(email);
        if (!emailCheck) {
            serverLogger('email invalid: ' + email);
            return;
        }

        const { error, data: signupResData } = await db(
            (supabaseClient: RelayDatabase) => () => supabaseClient.auth.signUp({ email, password }),
        )();

        let id = signupResData?.user?.id;
        if (error?.message.includes('User already registered')) {
            const { error: error2, data: signInResData } = await db(
                (supabaseClient: RelayDatabase) => () =>
                    supabaseClient.auth.signInWithPassword({
                        email,
                        password,
                    }),
            )();
            id = signInResData?.user?.id;
            if (error2) {
                serverLogger(error2?.message || 'Unknown error signing in' + email);
                return;
            }
        }

        if (!id) {
            serverLogger('Error creating profile, no id in response');
            return;
        }
        const profileBody: ProfileInsertBody = {
            id,
            email,
            company_id: company.id,
            first_name: 'BoostBot',
            last_name: 'Support',
            user_role: 'company_owner',
        };
        const { data, error: error2 } = await db(
            (supabaseClient: RelayDatabase) => () =>
                supabaseClient.from('profiles').upsert(profileBody).select('*').single(),
        )();
        if (!data || error2) {
            serverLogger('error inserting profile ' + error2?.message || 'unknown error');
        }
    } catch (error) {
        serverLogger(error, (scope) =>
            scope.setContext('Error', {
                error: 'Cannot create service account',
                company,
            }),
        );
    }
};

/** delete the company, the user, and cancel subscription if failed */
const rollback = async ({ companyId, cus_id, userId }: { companyId: string; cus_id: string; userId: string }) => {
    try {
        if (userId) {
            await db(deleteUserById)(userId);
        }
        if (companyId) {
            await db(deleteCompanyById)(companyId);
        }
        if (cus_id) {
            await stripeClient.customers.del(cus_id);
        }
    } catch (error) {
        serverLogger(error);
    }
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password, firstName, lastName, phoneNumber, companyName, companyWebsite, category } =
        validateAndParseData(req);

    await validateCompanyName({ companyName });

    const companyId = v4();
    let cus_id = '';
    let userId = '';

    try {
        const { cus_id: cusId, subscription } = await createStripeCustomerAndSubscription({
            companyName,
            companyId,
            email,
        });
        cus_id = cusId;

        const company = await createCompanyWithSubscriptionLimits({
            subscription,
            companyId,
            companyName,
            companyWebsite,
            cus_id,
        });

        userId = await createSupabaseUser({ email, password });

        const profile = await createProfile({ email, userId, firstName, lastName, phoneNumber, companyId });

        // these 3 calls won't throw and will just send a Sentry error
        if (category) {
            await db(addCompanyCategory)(company, category);
        }
        await createBrevoContact(profile, company);
        await createServiceAccount(company);

        const response: SignupPostResponse = company;

        return res.status(httpCodes.OK).json(response);
    } catch (error) {
        await rollback({ companyId, cus_id, userId });
        throw error;
    }
};

export default ApiHandler({
    postHandler,
});
