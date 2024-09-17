import { createHandler } from 'src/utils/handler/create-handler';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import { SubscriptionMigrationRequest } from './request';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

class ApiHandler {
    @POST()
    @Status(httpCodes.CREATED)
    async migrateSubscriptions(@Body(SubscriptionMigrationRequest) request: SubscriptionMigrationRequest) {
        const result = await SubscriptionV2Service.getService().migrateSubscription(request);
        return {
            result,
        };
    }
}

export default createHandler(ApiHandler);
