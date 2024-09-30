import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import type { PaginationParam } from 'types/pagination';
import OutreachEmailTemplateRepository from 'src/backend/database/sequence-email-template/sequence-email-template-repository';
import { IsNull } from 'typeorm';
import { StepNumber } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';

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
                templateVariables: true,
                steps: {
                    outreachEmailTemplate: true,
                },
            },
        });
        const defaultTemplates = await OutreachEmailTemplateRepository.getRepository().find({
            where: {
                company: { id: IsNull() },
            },
        });
        sequence.steps = sequence.steps.map((step) => {
            return {
                ...step,
                outreachEmailTemplate:
                    step.outreachEmailTemplate ||
                    defaultTemplates.find((template) => StepNumber[template.step] === step.stepNumber),
            };
        });
        const info = await SequenceInfluencerRepository.getRepository().getSequenceInfo(companyId, id);
        return { ...sequence, info };
    }
}
