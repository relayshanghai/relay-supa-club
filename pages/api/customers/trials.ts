import { StripeBackendService } from 'src/backend/domain/stripe/stripe-service';
import httpCodes from 'src/constants/httpCodes';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';

export class Handler {
    @GET()
    @Status(httpCodes.OK)
    async fetch() {
        const response = await StripeBackendService.getService().getTrialCustomers();
        return response;
    }
}

export default createHandler(Handler);
