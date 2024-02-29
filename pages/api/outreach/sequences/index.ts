import { createHandler } from 'src/utils/handler/create-handler';
import { SequenceRequest } from './request';
import { Body, POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SequenceService from 'src/backend/domain/sequence/sequence-service';

export class SequencesApiHandler {
    @POST()
    @Status(httpCodes.CREATED)
    async create(@Body(SequenceRequest) request: SequenceRequest) {
        const response = await SequenceService.getService().create(request);
        return response;
    }
}

export default createHandler(SequencesApiHandler);
