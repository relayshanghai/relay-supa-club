import { createHandler } from 'src/utils/handler/create-handler';
import { Status, POST } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { CreatePaymentMethodRequest } from './request';
import { IpAddress } from 'src/utils/handler/decorators/api-request-ip-decorator';

class SubscriptionSetupHandler {
    @POST()
    @Status(httpCodes.CREATED)
    async createSubscription(
        @Body(CreatePaymentMethodRequest) request: CreatePaymentMethodRequest,
        @IpAddress() ipAddress: string,
    ) {
        const result = await SubscriptionV2Service.getService().addPaymentMethod(request, ipAddress);
        return {
            ...result,
            ipAddress,
        };
    }
}

export default createHandler(SubscriptionSetupHandler);
