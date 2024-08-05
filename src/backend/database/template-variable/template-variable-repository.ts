import { type Variable } from 'pages/api/v2/outreach/sequences/request';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { TemplateVariableEntity } from './template-variable-entity';
import { RequestContext } from 'src/utils/request-context/request-context';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class TemplateVariableRepository extends BaseRepository<TemplateVariableEntity> {
    static repository: TemplateVariableRepository = new TemplateVariableRepository();
    static getRepository(): TemplateVariableRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<TemplateVariableRepository>(
                TemplateVariableRepository.name,
            );
            if (contextRepository) {
                return contextRepository as TemplateVariableRepository;
            }
            const repository = new TemplateVariableRepository(TemplateVariableEntity, manager);
            RequestContext.registerRepository(TemplateVariableRepository.name, repository);
            return repository;
        }
        return TemplateVariableRepository.repository;
    }
    constructor(target: EntityTarget<TemplateVariableEntity> = TemplateVariableEntity, manager?: EntityManager) {
        super(target, manager);
    }

    async insertIntoTemplateVariables(sequenceId: string, variables: Variable[]) {
        const sequenceSteps = await Promise.all(
            variables.map((item) => {
                return TemplateVariableRepository.getRepository().save({
                    sequence: { id: sequenceId },
                    name: item.name,
                    key: item.name,
                    value: item.value,
                });
            }),
        );
        return sequenceSteps;
    }
}
