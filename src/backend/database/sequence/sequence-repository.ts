import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { SequenceEntity } from './sequence-entity';

@InjectInitializeDatabaseOnAllProps
export default class SequenceRepository extends BaseRepository<SequenceEntity> {
    static repository: SequenceRepository = new SequenceRepository();
    static getRepository(): SequenceRepository {
        return this.repository;
    }
    constructor() {
        super(SequenceEntity);
    }
}
