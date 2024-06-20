import { VercelCronAuth } from 'pages/api/utils/auth-function';
import BalanceService from 'src/backend/domain/balance/balance-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';

export class BalanceSchedulerHandler {
    @GET()
    @VercelCronAuth()
    async get() {
        return BalanceService.getService().scheduleAll();
    }
}

export default createHandler(BalanceSchedulerHandler);
