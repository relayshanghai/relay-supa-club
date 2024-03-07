import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { OutreachEmailTemplateEntity } from './sequence-email-template-entity';
import { In, type EntityManager, type EntityTarget } from 'typeorm';
import type { SequenceTemplate, Variable } from 'pages/api/outreach/sequences/request';
import type { OutreachEmailTemplateVariableEntity } from './sequence-email-template-variable-entity';
import { PreconditionError } from 'src/utils/error/http-error';

@InjectInitializeDatabaseOnAllProps
export default class OutreachEmailTemplateRepository extends BaseRepository<OutreachEmailTemplateEntity> {
    static repository: OutreachEmailTemplateRepository = new OutreachEmailTemplateRepository();
    static getRepository(): OutreachEmailTemplateRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<OutreachEmailTemplateRepository>(
                OutreachEmailTemplateRepository.name,
            );
            if (contextRepository) {
                return contextRepository as OutreachEmailTemplateRepository;
            }
            const repository = new OutreachEmailTemplateRepository(OutreachEmailTemplateEntity, manager);
            RequestContext.registerRepository(OutreachEmailTemplateRepository.name, repository);
            return repository;
        }
        return OutreachEmailTemplateRepository.repository;
    }
    constructor(
        target: EntityTarget<OutreachEmailTemplateEntity> = OutreachEmailTemplateEntity,
        manager?: EntityManager,
    ) {
        super(target, manager);
    }

    async checkTemplateStepIsUnique(
        companyId: string,
        sequenceTemplates: SequenceTemplate[],
    ): Promise<OutreachEmailTemplateEntity[]> {
        const templates = await this.find({
            where: {
                company: { id: companyId },
                id: In(sequenceTemplates.map((item) => item.id)),
            },
        });
        const steps = templates.map((item) => item?.step);
        const isUnique = new Set(steps).size === steps.length;
        if (!isUnique) {
            throw new PreconditionError('sequence template step is not unique');
        }
        return templates as OutreachEmailTemplateEntity[];
    }

    async checkTemplateVariables(companyId: string, sequenceTemplates: SequenceTemplate[], variables: Variable[]) {
        // iterate sequenceTemplates and get the data from OutreachTemplateRepository.getRepository().get(companyId, id)
        const templates = await this.find({
            where: {
                company: { id: companyId },
                id: In(sequenceTemplates.map((item) => item.id)),
            },
            relations: {
                variables: true,
            },
        });

        const templateVariables = templates.map((item) => item.variables) as OutreachEmailTemplateVariableEntity[][];
        templateVariables.forEach((templateItems) => {
            const fullfilledVariables = templateItems
                .map((item) => {
                    return variables.find((v) => v.name === item.name);
                })
                // filter out undefined
                .filter((item) => item);
            const isFullfilled = fullfilledVariables.length === templateItems.length;
            if (!isFullfilled) {
                throw new PreconditionError('sequence template variables is not fullfilled');
            }
        });
        return true;
    }
}
