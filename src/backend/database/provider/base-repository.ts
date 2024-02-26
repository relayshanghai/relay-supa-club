import type { EntityTarget, ObjectLiteral } from 'typeorm';
import { Repository } from 'typeorm';
import { DatabaseProvider } from './database-provider';

export default class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    constructor(entity: EntityTarget<E>) {
        const baseRepository = DatabaseProvider.getDatasource().getRepository<E>(entity);
        super(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
    }
}
