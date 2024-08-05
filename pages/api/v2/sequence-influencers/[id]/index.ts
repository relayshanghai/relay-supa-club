import { createHandler } from 'src/utils/handler/create-handler';
import { PATCH, Status } from 'src/utils/handler/decorators/api-decorator';
import { UpdateSequenceInfluencerRequest } from './request';
import SequenceInfluencerService from 'src/backend/domain/outreach/sequence-influencer-service';
import httpCodes from 'src/constants/httpCodes';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

class SequenceInfluencerIdHandler {
    @PATCH()
    @Status(httpCodes.NO_CONTENT)
    async update(
        @Path('id') sequenceInfluencerId: string,
        @Body(UpdateSequenceInfluencerRequest) request: UpdateSequenceInfluencerRequest,
    ) {
        await SequenceInfluencerService.getService().update(sequenceInfluencerId, request);
    }
}

export default createHandler(SequenceInfluencerIdHandler);
