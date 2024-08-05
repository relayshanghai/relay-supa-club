import { VercelCronAuth } from 'pages/api/utils/auth-function';
import SequenceInfluencerService from 'src/backend/domain/sequence/sequence-influencer-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';

export class SequenceInfluencerSchedulerHandler {
    @VercelCronAuth()
    @GET()
    async handle() {
        await SequenceInfluencerService.getService().startScheduler().then();
        return { message: 'success' };
    }
}

export default createHandler(SequenceInfluencerSchedulerHandler);
