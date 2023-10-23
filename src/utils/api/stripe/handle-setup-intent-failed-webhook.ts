import type { NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { SetupIntentFailed } from 'types/stripe/setup-intent-failed-webhook';

export const handleSetupIntentFailed = async (res: NextApiResponse, setupIntentBody: SetupIntentFailed) => {
    const { customer, last_setup_error } = setupIntentBody.data.object;
    if (!customer) {
        throw new Error('Missing customer ID in invoice body');
    }

    if (last_setup_error && last_setup_error.code === 'setup_intent_authentication_failure') {
        // console.log('setup_intent_authentication_failure');
    }

    return res.status(httpCodes.OK).json({});
};
