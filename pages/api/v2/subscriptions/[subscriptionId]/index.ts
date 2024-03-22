import { createHandler } from 'src/utils/handler/create-handler';
import { PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

class CancelResumeSubscriptionHandler {
    @PUT()
    @Status(httpCodes.OK)
    async updateSubscription(@Path('subscriptionId') subscriptionId: string) {
        if (subscriptionId === 'resume') {
            const result = await SubscriptionV2Service.getService().resumeSubscription();
            return result;
        }
    }
}

export default createHandler(CancelResumeSubscriptionHandler);
