import ThreadService from 'src/backend/domain/outreach/thread-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Path } from 'src/utils/handler/decorators/api-decorator';

class ThreadEmailHandler {
    @GET()
    async getEmails(@Path('id') id: string) {
        const response = await ThreadService.getService().getThreadEmail(id);
        return response;
    }
}

export default createHandler(ThreadEmailHandler);
