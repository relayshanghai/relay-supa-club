import type { SequenceRequest } from 'pages/api/outreach/sequences/request';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';

export default class SequenceService {
    public static readonly service: SequenceService = new SequenceService();
    static getService(): SequenceService {
        return SequenceService.service;
    }
    @CompanyIdRequired()
    async create(request: SequenceRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const response = await SequenceRepository.getRepository().save({ ...request, company: { id: companyId } });
        return response;
    }
}
