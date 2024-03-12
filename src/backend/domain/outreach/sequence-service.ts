import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';

export default class SequenceService {
    static service = new SequenceService();
    static getService(): SequenceService {
        return SequenceService.service;
    }
    @CompanyIdRequired()
    @UseLogger()
    async getAllSequences() {
        const companyId = RequestContext.getContext().companyId as string;
        const sequences = await SequenceRepository.getRepository().find({
            where: {
                company: { id: companyId },
            },
        });
        return sequences;
    }
}
