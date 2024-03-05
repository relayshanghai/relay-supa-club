import { type Variable } from 'pages/api/outreach/sequences/request';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { TemplateVariableEntity } from './template-variable-entity';

@InjectInitializeDatabaseOnAllProps
export default class TemplateVariableRepository extends BaseRepository<TemplateVariableEntity> {
    static repository: TemplateVariableRepository = new TemplateVariableRepository();
    static getRepository(): TemplateVariableRepository {
        return this.repository;
    }
    constructor() {
        super(TemplateVariableEntity);
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
