import { createHandler } from 'src/utils/handler/create-handler';
import { GET, POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import PlanService from 'src/backend/domain/plan/plan-service';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';
import type { CreatePlanRequest } from './request';
import { GetPlansQuery } from './request';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

export class APIHandler {
    @GET()
    @Status(httpCodes.OK)
    async fetch(@Query(GetPlansQuery) query: GetPlansQuery) {
        const response = await PlanService.getService().getPlanSummaries(query);
        return response;
    }

    @POST()
    @Status(httpCodes.OK)
    async create(@Body() data: CreatePlanRequest) {
        const response = await PlanService.getService().createPlan(data);
        return response;
    }
}

export default createHandler(APIHandler);
