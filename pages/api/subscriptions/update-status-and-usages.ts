import { ApiHandler } from 'src/utils/api-handler';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import updateSubscriptionUsagesAndStatus from 'src/utils/api/update-subscription-usage-status';

export type UpdateStatusAndUsagesRequestBody = {
    companyId: string;
    subscriptionId: string;
    priceId: string;
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { companyId, subscriptionId, priceId } = req.body as UpdateStatusAndUsagesRequestBody;

    updateSubscriptionUsagesAndStatus(companyId, subscriptionId, priceId);

    return res.status(httpCodes.OK).json('success');
};

export default ApiHandler({
    postHandler,
});
