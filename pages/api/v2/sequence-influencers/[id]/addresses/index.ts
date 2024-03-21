import { Body, GET, PATCH, Path, Status } from 'src/utils/handler/decorators/api-decorator';
import { UpdateAddressRequest } from './request';
import SequenceInfluencerService from 'src/backend/domain/outreach/sequence-influencer-service';
import httpCodes from 'src/constants/httpCodes';
import { createHandler } from 'src/utils/handler/create-handler';

class SequenceInfluencerAddressHandler {
    @PATCH()
    @Status(httpCodes.NO_CONTENT)
    async updateAddress(
        @Path('id') sequenceInfluencerId: string,
        @Body(UpdateAddressRequest) request: UpdateAddressRequest,
    ) {
        await SequenceInfluencerService.getService().updateSequenceInfluencerAddress(sequenceInfluencerId, request);
    }
    @GET()
    async getAddress(@Path('id') sequenceInfluencerId: string) {
        const response = await SequenceInfluencerService.getService().getSequenceInfluencerAddress(
            sequenceInfluencerId,
        );
        return response;
    }
}

export default createHandler(SequenceInfluencerAddressHandler);
