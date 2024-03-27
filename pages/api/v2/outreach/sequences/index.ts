import { createHandler } from 'src/utils/handler/create-handler';
import { SequenceRequest, GetSequenceRequest } from './request';
import { GET, POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SequenceService from 'src/backend/domain/sequence/sequence-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';

export class SequencesApiHandler {
    @GET()
    @Status(httpCodes.OK)
    async get(@Query(GetSequenceRequest) request: GetSequenceRequest) {
        const response = await SequenceService.getService().get(request);
        return response;
    }

    @POST()
    @Status(httpCodes.CREATED)
    async create(@Body(SequenceRequest) request: SequenceRequest) {
        const response = await SequenceService.getService().create(request);
        return response;
    }
}

export default createHandler(SequencesApiHandler);
