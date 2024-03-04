import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { SequenceStepEntity } from './sequence-step-entity';

@InjectInitializeDatabaseOnAllProps
export default class SequenceStepRepository extends BaseRepository<SequenceStepEntity> {
    static repository: SequenceStepRepository = new SequenceStepRepository();
    static getRepository(): SequenceStepRepository {
        return this.repository;
    }
    constructor() {
        super(SequenceStepEntity);
    }
}
