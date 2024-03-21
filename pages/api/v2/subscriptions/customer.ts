import { createHandler } from 'src/utils/handler/create-handler';
import { GET, PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import { UpdateSubscriptionRequest } from './request';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { IpAddress } from 'src/utils/handler/decorators/api-request-ip-decorator';

class SubscriptionCustomerHandler {
    @GET()
    @Status(httpCodes.OK)
    async getCustomerInfo() {
        return await SubscriptionV2Service.getService().getCustomer();
    }
    @PUT()
    @Status(httpCodes.OK)
    async updateCustomerInfo(
        @Body(UpdateSubscriptionRequest) request: UpdateSubscriptionRequest,
        @IpAddress() ipAddress: string,
    ) {
        const { email } = request;
        const result = await SubscriptionV2Service.getService().updateCustomer({
            email,
        });
        return {
            ...result,
            ipAddress,
        };
    }
}

export default createHandler(SubscriptionCustomerHandler);
