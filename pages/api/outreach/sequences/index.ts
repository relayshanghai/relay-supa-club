import { createHandler } from 'src/utils/handler/create-handler';
import { SequenceRequest } from './request';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SequenceService from 'src/backend/domain/sequence/sequence-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

export class SequencesApiHandler {
    @POST()
    @Status(httpCodes.CREATED)
    async create(@Body(SequenceRequest) request: SequenceRequest) {
        const response = await SequenceService.getService().create(request);
        return response;
    }
}

export default createHandler(SequencesApiHandler);
