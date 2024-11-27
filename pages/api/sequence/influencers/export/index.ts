import { createHandler } from 'src/utils/handler/create-handler';
import { POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { InfluencerExportRequest } from './request';
import InfluencerService from 'src/backend/domain/influencer/influencer-service';
import { Res } from 'src/utils/handler/decorators/api-res-decorator';
import { type NextApiResponse } from 'next';
import { RequestContext } from 'src/utils/request-context/request-context';

export class APIHandler {
    @POST()
    @Status(httpCodes.OK)
    async callback(@Body(InfluencerExportRequest) body: InfluencerExportRequest, @Res() res: NextApiResponse) {
        const companyId = RequestContext.getContext().companyId;
        try {
            const csvData = await InfluencerService.getService().exportInfluencersToCsv(
                body.influencers.map((i) => i.id),
            );

            // Define a temporary file path

            const blob = new Blob([csvData], { type: 'text/csv' });
            const arrayBuffer = await blob.arrayBuffer();

            // Set headers for download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="exported-data-${companyId}-${Date.now()}.csv"`);
            res.send(Buffer.from(arrayBuffer));
        } catch (error) {
            res.status(500).json({ error: 'Failed to export influencers to CSV' });
        }
    }
}

export default createHandler(APIHandler);
