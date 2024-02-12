import { createHandler } from 'src/utils/handler/create-handler';
import { TemplateVariableRequest } from './request';
import { Body, DELETE, PUT, Path } from 'src/utils/handler/decorators/api-decorator';
import TemplateVariablesService from 'src/backend/domain/templates/template-variables';

export class EmailTemplateApiHandler {
    @PUT()
    async update(@Path('id') id: string, @Body(TemplateVariableRequest) request: TemplateVariableRequest) {
        const response = await TemplateVariablesService.getService().update(id, request);
        return response;
    }

    @DELETE()
    async delete(@Path('id') id: string) {
        const response = await TemplateVariablesService.getService().delete(id);
        return response;
    }
}

export default createHandler(EmailTemplateApiHandler);
