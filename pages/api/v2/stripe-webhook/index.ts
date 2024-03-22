import { createHandler } from 'src/utils/handler/create-handler';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import { StripeWebhookRequest } from './request';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { StripeWebhookService } from 'src/backend/domain/stripe/stripe-webhook-service';

class StripeWebhookHandler {
    @POST()
    @Status(httpCodes.OK)
    async webhookHandler(@Body(StripeWebhookRequest) request: StripeWebhookRequest) {
        return StripeWebhookService.getService().handler(request);
    }
}

export default createHandler(StripeWebhookHandler);
