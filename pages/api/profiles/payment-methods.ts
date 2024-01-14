import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ApiHandlerWithContext } from 'src/utils/api-handler';
import { getCustomerPaymentMethods } from 'src/utils/api/stripe/payment-method';
import { RequestContext } from 'src/utils/request-context/request-context';

export const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const customerId = RequestContext.getContext().customerId as string;
    const paymentMethods = await getCustomerPaymentMethods(customerId);
    res.send(paymentMethods);
};

export default ApiHandlerWithContext({
    getHandler,
});
