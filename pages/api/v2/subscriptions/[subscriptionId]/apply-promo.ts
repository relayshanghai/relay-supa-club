import { createHandler } from 'src/utils/handler/create-handler';
import { PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import { UpdateSubscriptionRequest } from './request';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { IpAddress } from 'src/utils/handler/decorators/api-request-ip-decorator';

class ApplyPromoHandler {
    @PUT()
    @Status(httpCodes.OK)
    async updateSubscription(
        @Path('subscriptionId') subscriptionId: string,
        @Body(UpdateSubscriptionRequest) request: UpdateSubscriptionRequest,
        @IpAddress() ipAddress: string,
    ) {
        const result = await SubscriptionV2Service.getService().applyPromo(subscriptionId, request);
        return { ...result, ipAddress };
    }
}

export default createHandler(ApplyPromoHandler);
