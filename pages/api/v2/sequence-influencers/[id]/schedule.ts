import { VercelCronAuth } from 'pages/api/utils/auth-function';
import SequenceInfluencerService from 'src/backend/domain/sequence/sequence-influencer-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class SequenceInfluencerSyncSchedulerHandler {
    @VercelCronAuth()
    @GET()
    async handle(@Path('id') sequenceInfluencerId: string) {
        await SequenceInfluencerService.getService().startSyncReport(sequenceInfluencerId);
        return { message: 'success' };
    }
}

export default createHandler(SequenceInfluencerSyncSchedulerHandler);
