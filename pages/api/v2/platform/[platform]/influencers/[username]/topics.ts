import InfluencerService from 'src/backend/domain/influencer/influencer-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

class InfluencerHandler {
    @GET()
    async getRelevantTopics(@Path('platform') platform: string, @Path('username') username: string) {
        return InfluencerService.getService().getRelevantTopics(platform, username);
    }
}

export default createHandler(InfluencerHandler);
