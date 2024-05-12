import { createHandler } from 'src/utils/handler/create-handler';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { POST } from 'src/utils/handler/decorators/api-decorator';
import { PostSequenceInfluencerRequest } from './request';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import SequenceService from 'src/backend/domain/sequence/sequence-service';

class SequenceInfluencerHandler {
    @POST()
    async addSequenceInfluencer(
        @Path('sequenceId') sequenceId: string,
        @Body(PostSequenceInfluencerRequest) body: PostSequenceInfluencerRequest,
    ) {
        await SequenceService.getService().addSequenceInfluencer(sequenceId, body.influencers);
    }
}

export default createHandler(SequenceInfluencerHandler);
