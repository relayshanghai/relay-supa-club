import { createHandler } from 'src/utils/handler/create-handler';
import { Status, POST, GET, PUT, DELETE } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { CreatePaymentMethodRequest, RemovePaymentMethodRequest, UpdateDefaultPaymentMethodRequest } from './request';
import { IpAddress } from 'src/utils/handler/decorators/api-request-ip-decorator';

class SubscriptionSetupHandler {
    @GET()
    @Status(httpCodes.OK)
    async getPaymentMethods() {
        const { data } = await SubscriptionV2Service.getService().getCustomerPaymentMethods();
        const defaultPaymentMethod = await SubscriptionV2Service.getService().getDefaultPaymentMethod();
        return {
            paymentMethods: data,
            defaultPaymentMethod,
        };
    }
    @POST()
    @Status(httpCodes.CREATED)
    async addPaynentMethod(
        @Body(CreatePaymentMethodRequest) request: CreatePaymentMethodRequest,
        @IpAddress() ipAddress: string,
    ) {
        const result = await SubscriptionV2Service.getService().addPaymentMethod(request, ipAddress);
        return {
            ...result,
            ipAddress,
        };
    }

    @PUT()
    @Status(httpCodes.OK)
    async updateDefaultPaymentMethod(
        @Body(UpdateDefaultPaymentMethodRequest) request: UpdateDefaultPaymentMethodRequest,
    ) {
        const result = await SubscriptionV2Service.getService().updateDefaultPaymentMethod(request.paymentMethodId);
        return result;
    }

    @DELETE()
    @Status(httpCodes.OK)
    async removePaymentMethod(@Body(RemovePaymentMethodRequest) request: RemovePaymentMethodRequest) {
        const result = await SubscriptionV2Service.getService().removePaymentMethod(request.paymentMethodId);
        return result;
    }
}

export default createHandler(SubscriptionSetupHandler);
