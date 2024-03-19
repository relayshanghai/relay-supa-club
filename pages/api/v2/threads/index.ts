import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { GetThreadsRequest } from './request';
import ThreadService from 'src/backend/domain/outreach/thread-service';
import type { GetThreadResponse } from './response';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';

class ThreadHandler {
    @GET()
    async getAll(@Query(GetThreadsRequest) param: GetThreadsRequest): Promise<GetThreadResponse> {
        const response = await ThreadService.getService().getAllThread(param);
        return response;
    }
}

export default createHandler(ThreadHandler);
