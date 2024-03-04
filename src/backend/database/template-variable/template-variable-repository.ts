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
}
