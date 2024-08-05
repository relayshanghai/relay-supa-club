import { GET } from 'src/utils/handler/decorators/api-decorator';
import { VercelCronAuth } from '../utils/auth-function';
import EmailSyncService from 'src/backend/domain/email/email-sync-service';
import { createHandler } from 'src/utils/handler/create-handler';

export class SyncEmailHandler {
    @VercelCronAuth()
    @GET()
    async startSyncEmail() {
        await EmailSyncService.getService().syncEmails();
        return { message: 'success' };
    }
}

export default createHandler(SyncEmailHandler);
