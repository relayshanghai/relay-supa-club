import { createHandler } from 'src/utils/handler/create-handler';
import { PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import { PostConfirmationRequest } from './request';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

class SubscriptionHandler {
    @PUT()
    @Status(httpCodes.NO_CONTENT)
    async postConfirmation(@Body(PostConfirmationRequest) request: PostConfirmationRequest) {
        const result = await SubscriptionV2Service.getService().postConfirmation(request);
        return result;
    }
}

export default createHandler(SubscriptionHandler);
