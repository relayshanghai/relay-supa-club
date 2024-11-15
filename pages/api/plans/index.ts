import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import PlanService from 'src/backend/domain/plan/plan-service';

export class APIHandler {
    @GET()
    @Status(httpCodes.OK)
    async fetch() {
        const response = await PlanService.getService().getPlans();
        return response;
    }
}

export default createHandler(APIHandler);
