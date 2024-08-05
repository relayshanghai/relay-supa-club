import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';

class SubscriptionSyncer {
    @GET()
    @Status(httpCodes.OK)
    async sync() {
        return SubscriptionV2Service.getService().syncSubscription();
    }
}

export default createHandler(SubscriptionSyncer);
