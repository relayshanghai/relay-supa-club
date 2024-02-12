import { createHandler } from 'src/utils/handler/create-handler';
import { GetTemplateRequest, TemplateRequest } from './request';
import { Body, GET, POST, Query } from 'src/utils/handler/decorators/api-decorator';
import TemplateService from 'src/backend/domain/templates/template-service';

export class EmailTemplateApiHandler {
    @POST()
    async create(@Body(TemplateRequest) request: TemplateRequest) {
        const response = await TemplateService.getService().create(request);
        return response;
    }

    @GET()
    async getAll(@Query(GetTemplateRequest) request: GetTemplateRequest) {
        const response = await TemplateService.getService().getAll(request);
        return response;
    }
}

export default createHandler(EmailTemplateApiHandler);
