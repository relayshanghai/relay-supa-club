import { createHandler } from 'src/utils/handler/create-handler';
import { PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import PlanService from 'src/backend/domain/plan/plan-service';
import { type CreatePlanRequest } from '../request';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class APIHandler {
    @PUT()
    @Status(httpCodes.OK)
    async update(@Body() data: CreatePlanRequest, @Path('id') id: string) {
        const response = await PlanService.getService().updatePlan(id, data);
        return response;
    }
}

export default createHandler(APIHandler);
