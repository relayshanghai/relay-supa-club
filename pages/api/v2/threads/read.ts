import { createHandler } from 'src/utils/handler/create-handler';
import { PATCH, Status } from 'src/utils/handler/decorators/api-decorator';
import { ReadThreadRequest } from './request';
import ThreadService from 'src/backend/domain/outreach/thread-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import httpCodes from 'src/constants/httpCodes';

class ReadThreadHandler {
    @PATCH()
    @Status(httpCodes.OK)
    async readThreads(@Body(ReadThreadRequest) body: ReadThreadRequest): Promise<void> {
        const response = await ThreadService.getService().readThreadIds(body);
        return response;
    }
}

export default createHandler(ReadThreadHandler);
