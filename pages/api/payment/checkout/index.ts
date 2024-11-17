import { createHandler } from 'src/utils/handler/create-handler';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import PaymentService from 'src/backend/domain/payment/payment-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { CheckoutRequest } from './request';
import { IpAddress } from 'src/utils/handler/decorators/api-request-ip-decorator';

export class APIHandler {
    @POST()
    @Status(httpCodes.OK)
    async checkout(@Body(CheckoutRequest) body: CheckoutRequest, @IpAddress() ipAddress: string) {
        const response = await PaymentService.getService().checkout(body);
        return { ...response, ipAddress };
    }
}

export default createHandler(APIHandler);
