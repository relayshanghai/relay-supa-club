import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import PlanService from 'src/backend/domain/plan/plan-service';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';
import { GetPlansQuery } from './request';

export class APIHandler {
    @GET()
    @Status(httpCodes.OK)
    async fetch(@Query(GetPlansQuery) query: GetPlansQuery) {
        const response = await PlanService.getService().getPlans(query);
        return response;
    }
}

export default createHandler(APIHandler);
