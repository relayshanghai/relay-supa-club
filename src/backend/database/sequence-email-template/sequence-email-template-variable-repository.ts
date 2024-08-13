import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { type EntityManager, type EntityTarget } from 'typeorm';
import { OutreachEmailTemplateVariableEntity } from './sequence-email-template-variable-entity';

@InjectInitializeDatabaseOnAllProps
export default class OutreachEmailTemplateVariableRepository extends BaseRepository<OutreachEmailTemplateVariableEntity> {
    static repository: OutreachEmailTemplateVariableRepository = new OutreachEmailTemplateVariableRepository();
    static getRepository(): OutreachEmailTemplateVariableRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<OutreachEmailTemplateVariableRepository>(
                OutreachEmailTemplateVariableRepository.name,
            );
            if (contextRepository) {
                return contextRepository as OutreachEmailTemplateVariableRepository;
            }
            const repository = new OutreachEmailTemplateVariableRepository(
                OutreachEmailTemplateVariableEntity,
                manager,
            );
            RequestContext.registerRepository(OutreachEmailTemplateVariableRepository.name, repository);
            return repository;
        }
        return OutreachEmailTemplateVariableRepository.repository;
    }
    constructor(
        target: EntityTarget<OutreachEmailTemplateVariableEntity> = OutreachEmailTemplateVariableEntity,
        manager?: EntityManager,
    ) {
        super(target, manager);
    }
}
