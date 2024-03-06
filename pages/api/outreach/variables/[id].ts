import { createHandler } from 'src/utils/handler/create-handler';
import { TemplateVariableRequest } from './request';
import { DELETE, PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import TemplateVariablesService from 'src/backend/domain/templates/template-variables-service';
import httpCodes from 'src/constants/httpCodes';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

export class EmailTemplateApiHandler {
    @PUT()
    @Status(httpCodes.NO_CONTENT)
    async update(@Path('id') id: string, @Body(TemplateVariableRequest) request: TemplateVariableRequest) {
        const response = await TemplateVariablesService.getService().update(id, request);
        return response;
    }

    @DELETE()
    @Status(httpCodes.NO_CONTENT)
    async delete(@Path('id') id: string) {
        const response = await TemplateVariablesService.getService().delete(id);
        return response;
    }
}

export default createHandler(EmailTemplateApiHandler);
