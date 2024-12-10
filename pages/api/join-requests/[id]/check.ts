import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import JoinRequestService from 'src/backend/domain/join-request/join-request-service';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class APIHandler {
    @GET()
    @Status(httpCodes.OK)
    async checkRequest(@Path('id') email: string) {
        const response = await JoinRequestService.getService().checkByEmail(email);
        return response;
    }
}

export default createHandler(APIHandler);
