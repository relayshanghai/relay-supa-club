import SequenceInfluencerService from 'src/backend/domain/outreach/sequence-influencer-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { AddMultipleInfluencerRequest } from './request';
import { createHandler } from 'src/utils/handler/create-handler';

export class SequenceInfluencerHandler {
    @POST()
    @Status(201)
    async addInfluencer(
        @Path('id') sequenceId: string,
        @Body(AddMultipleInfluencerRequest) request: AddMultipleInfluencerRequest,
    ) {
        await SequenceInfluencerService.getService().addInfluencerToSequence(sequenceId, ...request.influencers);
    }
}

export default createHandler(SequenceInfluencerHandler);
