import { createHandler } from 'src/utils/handler/create-handler';
import { TemplateVariableRequest } from './request';
import { Body, GET, POST } from 'src/utils/handler/decorators/api-decorator';
import TemplateVariablesService from 'src/backend/domain/templates/template-variables';

export class EmailTemplateApiHandler {
    @POST()
    async create(@Body(TemplateVariableRequest) request: TemplateVariableRequest) {
        const response = await TemplateVariablesService.getService().create(request);
        return response;
    }

    @GET()
    async getAll() {
        const response = await TemplateVariablesService.getService().get();
        return response;
    }
}

export default createHandler(EmailTemplateApiHandler);
