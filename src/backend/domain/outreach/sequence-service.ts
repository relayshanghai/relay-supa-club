import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import type { PaginationParam } from 'types/pagination';

export default class SequenceService {
    static service = new SequenceService();
    static getService(): SequenceService {
        return SequenceService.service;
    }
    @CompanyIdRequired()
    @UseLogger()
    async getAllSequences(paginationParam: PaginationParam) {
        const companyId = RequestContext.getContext().companyId as string;
        const sequences = await SequenceRepository.getRepository().getAllPaginated(companyId, paginationParam);
        const info = await SequenceInfluencerRepository.getRepository().getSequenceInfo(companyId);
        return { ...sequences, info };
    }
    @CompanyIdRequired()
    @UseLogger()
    async getForDropdown() {
        const companyId = RequestContext.getContext().companyId as string;
        const sequences = await SequenceRepository.getRepository().find({
            where: {
                company: { id: companyId },
            },
        });
        return sequences;
    }
    @CompanyIdRequired()
    @UseLogger()
    async getById(id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const sequence = await SequenceRepository.getRepository().findOneOrFail({
            where: {
                id,
            },
            relations: {
                product: true,
                steps: {
                    outreachEmailTemplate: true,
                },
            },
        });
        const info = await SequenceInfluencerRepository.getRepository().getSequenceInfo(companyId, id);
        return { ...sequence, info };
    }
}
