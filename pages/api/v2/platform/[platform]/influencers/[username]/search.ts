import InfluencerService from 'src/backend/domain/influencer/influencer-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import type { Platforms } from 'types';

class RequestHandler {
    @GET()
    async searchByUsername(@Path('platform') platform: string, @Path('username') username: string) {
        const data = await InfluencerService.getService().searchByUsername(username, platform as Platforms);
        return data;
    }
}

export default createHandler(RequestHandler);
