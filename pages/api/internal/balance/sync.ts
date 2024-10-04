import { createHandler } from 'src/utils/handler/create-handler';
import { PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { SyncBalanceRequest } from './request';

class ApiHandler {
    @PUT()
    @Status(httpCodes.OK)
    async syncBAlance(@Body(SyncBalanceRequest) body: SyncBalanceRequest) {
        const result = await SubscriptionV2Service.getService().syncAllBalances(body);
        return result;
    }
}

export default createHandler(ApiHandler);
