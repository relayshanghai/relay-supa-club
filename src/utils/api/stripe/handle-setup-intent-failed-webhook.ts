import type { NextApiResponse } from 'next';
import router from 'next/router';
import httpCodes from 'src/constants/httpCodes';
import type { SetupIntentFailed } from 'types/stripe/setup-intent-failed-webhook';

export const handleSetupIntentFailed = async (res: NextApiResponse, setupIntentBody: SetupIntentFailed) => {
    const { customer, last_setup_error } = setupIntentBody.data.object;
    if (!customer) {
        throw new Error('Missing customer ID in invoice body');
    }

    const selectedPlan = localStorage.getItem('selectedPlan');
    if (!selectedPlan) {
        router.push('/upgrade');
        // throw error cannot find selected plan from local storage
    }

    if (last_setup_error && last_setup_error.code === 'setup_intent_authentication_failure') {
        router.push(`/payments?plan=${selectedPlan}`);
        // return the error to the client
    }

    return res.status(httpCodes.OK).json({});
};
