import SequenceInfluencerService from 'src/backend/domain/outreach/sequence-influencer-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { createHandler } from 'src/utils/handler/create-handler';
import { DeleteInfluencerRequest } from './request';

export class DeleteSequenceInfluencerHandler {
    @POST()
    @Status(204)
    async deleteInfluencer(
        @Path('id') sequenceId: string,
        @Body(DeleteInfluencerRequest) request: DeleteInfluencerRequest,
    ) {
        const response = await SequenceInfluencerService.getService().deleteInfluencerFromSequence(sequenceId, request);
        return response;
    }
}

export default createHandler(DeleteSequenceInfluencerHandler);
