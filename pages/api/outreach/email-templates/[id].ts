import { createHandler } from 'src/utils/handler/create-handler';
import { TemplateRequest } from './request';
import { Body, GET, PUT, Path, Status } from 'src/utils/handler/decorators/api-decorator';
import TemplateService from 'src/backend/domain/templates/template-service';
import httpCodes from 'src/constants/httpCodes';

export class EmailTemplateIdApiHandler {
    @PUT()
    @Status(httpCodes.NO_CONTENT)
    async update(@Path('id') id: string, @Body(TemplateRequest) request: TemplateRequest) {
        const response = await TemplateService.getService().update(id, request);
        return response;
    }
    @GET()
    async GetOne(@Path('id') id: string) {
        const response = await TemplateService.getService().getOne(id);
        return response;
    }
}

export default createHandler(EmailTemplateIdApiHandler);
