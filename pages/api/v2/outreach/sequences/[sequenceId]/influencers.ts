import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import SequenceService from 'src/backend/domain/sequence/sequence-service';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';
import { GetInfluencersRequest } from './requests';

export class SequencesApiHandler {
    @GET()
    @Status(httpCodes.OK)
    async get(@Query(GetInfluencersRequest) request: GetInfluencersRequest, @Path('sequenceId') sequenceId: string) {
        const response = await SequenceService.getService().getSequenceInfluencers(request, sequenceId);
        return response;
    }
}

export default createHandler(SequencesApiHandler);
