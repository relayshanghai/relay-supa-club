import { createHandler } from 'src/utils/handler/create-handler';
import { GET, PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import { SubscriptionMigrationRequest } from './request';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

class ApiHandler {
    @GET()
    @Status(httpCodes.OK)
    async getSubscriptions() {
        const result = await SubscriptionV2Service.getService().getListOfAllSubscriptions();
        return result;
    }

    @PUT()
    @Status(httpCodes.OK)
    async migrateSubscriptions(@Body(SubscriptionMigrationRequest) request: SubscriptionMigrationRequest) {
        const result = await SubscriptionV2Service.getService().migrateSubscription(request);
        return result;
    }
}

export default createHandler(ApiHandler);
