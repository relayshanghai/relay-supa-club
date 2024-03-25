import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import { GetProductRequest } from './request';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';

class SubscriptionProductHandler {
    @GET()
    @Status(httpCodes.OK)
    async getProductInfo(@Query(GetProductRequest) request: GetProductRequest) {
        return await SubscriptionV2Service.getService().getProduct(request.productId);
    }
}

export default createHandler(SubscriptionProductHandler);
