import { createHandler } from 'src/utils/handler/create-handler';
import { DELETE, PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import JoinRequestService from 'src/backend/domain/join-request/join-request-service';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class APIHandler {
    @PUT()
    @Status(httpCodes.OK)
    async acceptAction(@Path('id') id: string) {
        const response = await JoinRequestService.getService().joinRequestAction(id, 'accept');
        return response;
    }

    @DELETE()
    @Status(httpCodes.OK)
    async ignoreAction(@Path('id') id: string) {
        const response = await JoinRequestService.getService().joinRequestAction(id, 'ignore');
        return response;
    }
}

export default createHandler(APIHandler);
