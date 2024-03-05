import { createHandler } from 'src/utils/handler/create-handler';
import { VercelCronAuth } from '../utils/auth-function';
import { GET } from 'src/utils/handler/decorators/api-decorator';
import EmailSyncService from 'src/backend/domain/email/email-sync-service';
import { logger } from 'src/backend/integration/logger';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class SyncEmailAccountHandler {
    @VercelCronAuth()
    @GET()
    async startSyncAccount(@Path('accountId') accountId: string) {
        EmailSyncService.getService()
            .syncEmailByAccountId(accountId)
            .then(() => {
                logger.info(`success sync account`, { accountId });
            })
            .catch((err) => {
                logger.error(`error sync account`, { accountId, err });
            });
        return {
            message: `Syncing account ${accountId}`,
        };
    }
}

export default createHandler(SyncEmailAccountHandler);
