import SequenceInfluencerService from 'src/backend/domain/outreach/sequence-influencer-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { Status, PATCH } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { createHandler } from 'src/utils/handler/create-handler';
import { PatchSequenceInfluencerRequest } from './request';

export class SequenceInfluencerHandler {
    @PATCH()
    @Status(204)
    async updatePatch(
        @Path('id') sequenceId: string,
        @Path('influencerId') influencerId: string,
        @Body(PatchSequenceInfluencerRequest) request: PatchSequenceInfluencerRequest,
    ) {
        await SequenceInfluencerService.getService().updateEmail(sequenceId, influencerId, request.email);
    }
}

export default createHandler(SequenceInfluencerHandler);
