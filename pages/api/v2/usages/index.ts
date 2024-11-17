import { CreditService } from 'src/backend/domain/credit/credit-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';

class ApiHandler {
    @GET()
    async getAll() {
        const response = await CreditService.getService().getTotalCredit();
        return response;
    }
}

export default createHandler(ApiHandler);
