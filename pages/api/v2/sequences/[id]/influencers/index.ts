import SequenceInfluencerService from 'src/backend/domain/outreach/sequence-influencer-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { GET, POST, Status } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { AddMultipleInfluencerRequest } from './request';
import { createHandler } from 'src/utils/handler/create-handler';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';
import { GetSequenceInfluencerRequest } from './get-influencer-request';

export class SequenceInfluencerHandler {
    @POST()
    @Status(201)
    async addInfluencer(
        @Path('id') sequenceId: string,
        @Body(AddMultipleInfluencerRequest) request: AddMultipleInfluencerRequest,
    ) {
        const response = await SequenceInfluencerService.getService().addInfluencerToSequence(
            sequenceId,
            ...request.influencers,
        );
        return response;
    }

    @GET()
    async getInfluencers(
        @Path('id') sequenceId: string,
        @Query(GetSequenceInfluencerRequest) request: GetSequenceInfluencerRequest,
    ) {
        const response = await SequenceInfluencerService.getService().getAll(sequenceId, request);
        return response;
    }
}

export default createHandler(SequenceInfluencerHandler);
