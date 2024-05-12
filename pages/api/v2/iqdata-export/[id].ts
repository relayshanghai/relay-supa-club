import { VercelCronAuth } from 'pages/api/utils/auth-function';
import ExportIqdataService from 'src/backend/domain/export-iqdata/export-iqdata-service';
import { NO_CONTENT } from 'src/constants/httpCodes';
import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Status } from 'src/utils/handler/decorators/api-decorator';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';

export class IQDataExportHandler {
    @VercelCronAuth()
    @GET()
    @Status(NO_CONTENT)
    async startIQDataExport(@Path('id') exportId: string) {
        await ExportIqdataService.getService().fetchExport(exportId);
    }
}

export default createHandler(IQDataExportHandler);
