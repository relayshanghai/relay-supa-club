import { ApiHandlerWithContext } from 'src/utils/api-handler';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionDomain from 'src/backend/domain/subscription';

export type UpgradeSubscription = {
    priceId: string;
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { priceId } = req.body as UpgradeSubscription;
    await SubscriptionDomain.getService().upgradeSubscription(priceId);
    return res.status(httpCodes.OK).json('success');
};

export default ApiHandlerWithContext({
    postHandler,
});
