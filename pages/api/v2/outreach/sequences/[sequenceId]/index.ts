import { createHandler } from 'src/utils/handler/create-handler';
import { SequenceRequest } from '../request';
import { PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SequenceService from 'src/backend/domain/sequence/sequence-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class SequencesApiHandler {
    @PUT()
    @Status(httpCodes.OK)
    async create(@Body(SequenceRequest) request: SequenceRequest, @Path('sequenceId') sequenceId: string) {
        const response = await SequenceService.getService().update(request, sequenceId);
        return response;
    }
}

export default createHandler(SequencesApiHandler);
