import { createHandler } from 'src/utils/handler/create-handler';
import { Body, POST, Path, Status } from 'src/utils/handler/decorators/api-decorator';
import { ReplyRequest } from './reply-request';
import { HttpStatusCode } from 'axios';
import ThreadService from 'src/backend/domain/outreach/thread-service';

class ReplyHandler {
    @POST()
    @Status(HttpStatusCode.NoContent)
    async post(@Path('id') id: string, @Body(ReplyRequest) body: ReplyRequest) {
        await ThreadService.getService().reply(id, body);
    }
}

export default createHandler(ReplyHandler);
