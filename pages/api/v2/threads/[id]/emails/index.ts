import ThreadService from 'src/backend/domain/outreach/thread-service';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

class ThreadEmailHandler {
    @GET()
    async getEmails(@Path('id') id: string) {
        const response = await ThreadService.getService().getThreadEmail(id);
        return response;
    }
}

export const config = {
    api: {
        responseLimit: '8mb',
    },
};

export default createHandler(ThreadEmailHandler);
