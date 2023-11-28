import type { NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { SetupIntentFailed } from 'types/stripe/setup-intent-failed-webhook';

export const handleSetupIntentFailed = async (res: NextApiResponse, setupIntentBody: SetupIntentFailed) => {
    const { customer } = setupIntentBody.data.object;
    if (!customer) {
        throw new Error('Missing customer ID in invoice body');
    }

    return res.status(httpCodes.OK).json({});
};
