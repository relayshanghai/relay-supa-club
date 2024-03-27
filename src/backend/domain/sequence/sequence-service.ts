import type {
    SequenceRequest,
    GetSequenceRequest,
    SequenceTemplate,
    Variable,
    GetSequenceResponse,
} from 'pages/api/v2/outreach/sequences/request';
import { CompanyIdRequired } from '../decorators/company-id';
import { RequestContext } from 'src/utils/request-context/request-context';
import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';
import { type SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import SequenceRepository from 'src/backend/database/sequence/sequence-repository';
import ProductRepository from 'src/backend/database/product/product-repository';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import SequenceStepRepository from 'src/backend/database/sequence/sequence-step-repository';
import TemplateVariableRepository from 'src/backend/database/template-variable/template-variable-repository';
import OutreachEmailTemplateRepository from 'src/backend/database/sequence-email-template/sequence-email-template-repository';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import type { ProfileEntity } from 'src/backend/database/profile/profile-entity';

export default class SequenceService {
    public static readonly service: SequenceService = new SequenceService();
    static getService(): SequenceService {
        return SequenceService.service;
    }

    @CompanyIdRequired()
    async get(request: GetSequenceRequest): Promise<GetSequenceResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const { sequences, totalCount } = await SequenceRepository.getRepository().getSequences({
            ...request,
            companyId,
        });
        if (request.page * request.size > totalCount) {
            throw new NotFoundError('No sequences found at this page number');
        }
        return {
            page: request.page,
            size: request.size,
            totalItems: totalCount,
            items: sequences.map((sequence) => ({
                id: sequence.id,
                name: sequence.name,
                product: sequence.product as ProductEntity,
                autoStart: sequence.autoStart,
                totalInfluencers: sequence.totalInfluencers,
            })),
        };
    }

    @UseTransaction()
    @CompanyIdRequired()
    async create(request: SequenceRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const user = RequestContext.getContext().session?.user;
        const profile = await ProfileRepository.getRepository().findOne({ where: { id: user?.id } });
        const sequenceTemplates = request.sequenceTemplates;
        const templateVariables = request.variables;
        const emailTemplates = await OutreachEmailTemplateRepository.getRepository().checkTemplateStepIsUnique(
            companyId,
            sequenceTemplates as SequenceTemplate[],
        );
        await OutreachEmailTemplateRepository.getRepository().checkTemplateVariables(
            companyId,
            sequenceTemplates as SequenceTemplate[],
            templateVariables as Variable[],
        );

        const [err, product] = await awaitToError(
            ProductRepository.getRepository().findOne({ where: { id: request.productId } }),
        );
        if (err) {
            throw new NotFoundError('Product not found');
        }
        const sequence = await SequenceRepository.getRepository().save({
            ...request,
            company: { id: companyId },
            product: { id: product?.id },
            manager: { id: user?.id },
            managerFirstName: profile?.firstName,
        });
        await SequenceStepRepository.getRepository().insertIntoSequenceStep(sequence.id, emailTemplates);
        await TemplateVariableRepository.getRepository().insertIntoTemplateVariables(
            sequence.id,
            templateVariables as Variable[],
        );
        return sequence;
    }

    async moveManager(originalProfile: ProfileEntity, newProfile: ProfileEntity) {
        await SequenceRepository.getRepository().moveManager(originalProfile, newProfile);
    }

    @UseTransaction()
    @CompanyIdRequired()
    async update(request: SequenceRequest, id: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const sequenceTemplates = request.sequenceTemplates;
        const templateVariables = request.variables;
        const emailTemplates = await OutreachEmailTemplateRepository.getRepository().checkTemplateStepIsUnique(
            companyId,
            sequenceTemplates as SequenceTemplate[],
        );
        await OutreachEmailTemplateRepository.getRepository().checkTemplateVariables(
            companyId,
            sequenceTemplates as SequenceTemplate[],
            templateVariables as Variable[],
        );
        const [err, existingSequence] = await awaitToError(
            SequenceRepository.getRepository().findOneOrFail({ where: { id } }),
        );
        if (err) {
            throw new NotFoundError('Sequence not found');
        }

        let product = null;
        if (request.productId) {
            const [err, p] = await awaitToError(
                ProductRepository.getRepository().findOne({ where: { id: request.productId } }),
            );
            if (err) {
                throw new NotFoundError('Product not found');
            }
            product = p;
        }
        const newData = {
            ...existingSequence,
            ...request,
        } as SequenceEntity;
        if (product) {
            newData.product = { id: product?.id } as ProductEntity;
        }

        const sequence = await SequenceRepository.getRepository().save(newData);
        await SequenceStepRepository.getRepository().insertIntoSequenceStep(sequence.id, emailTemplates);
        await TemplateVariableRepository.getRepository().delete({ sequence: { id: sequence.id } });
        await TemplateVariableRepository.getRepository().insertIntoTemplateVariables(
            sequence.id,
            templateVariables as Variable[],
        );
        return sequence;
    }
}
