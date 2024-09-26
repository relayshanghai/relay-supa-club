import { createHandler } from 'src/utils/handler/create-handler';
import { PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';

class ApiHandler {
    @PUT()
    @Status(httpCodes.OK)
    async syncAllSubscriptions() {
        const result = await SubscriptionV2Service.getService().syncAllSubscriptions();
        return result;
    }
}

export default createHandler(ApiHandler);
