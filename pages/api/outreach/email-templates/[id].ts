import { createHandler } from 'src/utils/handler/create-handler';
import { TemplateRequest } from './request';
import { DELETE, GET, PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import TemplateService from 'src/backend/domain/templates/template-service';
import httpCodes from 'src/constants/httpCodes';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

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
    @DELETE()
    @Status(httpCodes.NO_CONTENT)
    async delete(@Path('id') id: string) {
        const response = await TemplateService.getService().delete(id);
        return response;
    }
}

export default createHandler(EmailTemplateIdApiHandler);
