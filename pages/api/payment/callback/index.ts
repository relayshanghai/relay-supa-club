import { createHandler } from 'src/utils/handler/create-handler';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import PaymentService from 'src/backend/domain/payment/payment-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { PaymentCallbackRequest } from './request';

export class APIHandler {
    @POST()
    @Status(httpCodes.OK)
    async callback(@Body(PaymentCallbackRequest) body: PaymentCallbackRequest) {
        const response = await PaymentService.getService().callback(body);
        return response;
    }
}

export default createHandler(APIHandler);
