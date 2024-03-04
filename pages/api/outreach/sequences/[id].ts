import { createHandler } from 'src/utils/handler/create-handler';
import { SequenceRequest } from './request';
import { Body, PUT, Path, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SequenceService from 'src/backend/domain/sequence/sequence-service';

export class SequencesApiHandler {
    @PUT()
    @Status(httpCodes.OK)
    async create(@Body(SequenceRequest) request: SequenceRequest, @Path('id') id: string) {
        const response = await SequenceService.getService().update(request, id);
        return response;
    }
}

export default createHandler(SequencesApiHandler);
