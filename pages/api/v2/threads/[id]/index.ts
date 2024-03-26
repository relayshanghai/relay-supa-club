import ThreadService from 'src/backend/domain/outreach/thread-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

class ThreadHandler {
    @GET()
    async get(@Path('id') id: string) {
        return ThreadService.getService().getThread(id);
    }
}

export default createHandler(ThreadHandler);
