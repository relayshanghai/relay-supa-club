import ThreadService from 'src/backend/domain/outreach/thread-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';
import { GetThreadEmailsRequest } from './request';

class ThreadEmailHandler {
    @GET()
    async getEmails(@Path('id') id: string, @Query(GetThreadEmailsRequest) params: GetThreadEmailsRequest) {
        const response = await ThreadService.getService().getThreadEmail(id, params);
        return response;
    }
}

export default createHandler(ThreadEmailHandler);
