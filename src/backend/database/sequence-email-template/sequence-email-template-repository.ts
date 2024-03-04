import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { OutreachEmailTemplateEntity } from './sequence-email-template-entity';

@InjectInitializeDatabaseOnAllProps
export default class outreachEmailTemplateRepository extends BaseRepository<OutreachEmailTemplateEntity> {
    static repository: outreachEmailTemplateRepository = new outreachEmailTemplateRepository();
    static getRepository(): outreachEmailTemplateRepository {
        return this.repository;
    }
    constructor() {
        super(OutreachEmailTemplateEntity);
    }
}
