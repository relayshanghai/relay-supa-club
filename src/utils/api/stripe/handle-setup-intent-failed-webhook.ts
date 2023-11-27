import type { NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { SetupIntentFailed } from 'types/stripe/setup-intent-failed-webhook';

export const handleSetupIntentFailed = async (res: NextApiResponse, setupIntentBody: SetupIntentFailed) => {
    const { customer } = setupIntentBody.data.object;
    if (!customer) {
        throw new Error('Missing customer ID in invoice body');
    }
    //currently we handle the fail setup in the client side on the /confirm-alipay page, this is a placeholder for future uses

    return res.status(httpCodes.OK).json({ message: 'OK' });
};
