import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import JoinRequestService from 'src/backend/domain/join-request/join-request-service';

export class APIHandler {
    @GET()
    @Status(httpCodes.OK)
    async fetch() {
        const response = await JoinRequestService.getService().getJoinRequestCompany();
        return response;
    }
}

export default createHandler(APIHandler);
