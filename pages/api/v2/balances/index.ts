import BalanceService from 'src/backend/domain/balance/balance-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';

export class BalanceHandler {
    @GET()
    async get() {
        return BalanceService.getService().getAllBalance();
    }
}

export default createHandler(BalanceHandler);
