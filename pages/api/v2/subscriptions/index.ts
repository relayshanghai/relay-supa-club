import { createHandler } from 'src/utils/handler/create-handler';
import { DELETE, GET, PATCH, POST, Status } from 'src/utils/handler/decorators/api-decorator';
import { ChangeSubscriptionRequest, CreateSubscriptionRequest } from './request';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { IpAddress } from 'src/utils/handler/decorators/api-request-ip-decorator';

class SubscriptionHandler {
    @POST()
    @Status(httpCodes.CREATED)
    async createSubscription(
        @Body(CreateSubscriptionRequest) request: CreateSubscriptionRequest,
        @IpAddress() ipAddress: string,
    ) {
        const result = await SubscriptionV2Service.getService().createSubscription(request);
        return {
            ...result,
            ipAddress,
        };
    }

    @DELETE()
    @Status(httpCodes.NO_CONTENT)
    async cancelSubscription() {
        await SubscriptionV2Service.getService().cancelSubscription();
    }

    @GET()
    @Status(httpCodes.OK)
    async getSubscriptions() {
        return SubscriptionV2Service.getService().getSubscription();
    }

    @PATCH()
    @Status(httpCodes.OK)
    async updateSubscription(@Body(ChangeSubscriptionRequest) request: ChangeSubscriptionRequest) {
        return SubscriptionV2Service.getService().changeSubscription(request);
    }
}

export default createHandler(SubscriptionHandler);
