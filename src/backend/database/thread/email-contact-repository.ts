import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { EmailContactEntity } from './email-contact-entity';
import { In, type EntityManager, type EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export default class EmailContactRepository extends BaseRepository<EmailContactEntity> {
    static repository = new EmailContactRepository();
    static getRepository(): EmailContactRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<EmailContactRepository>(EmailContactRepository.name);
            if (contextRepository) {
                return contextRepository as EmailContactRepository;
            }
            const repository = new EmailContactRepository(EmailContactEntity, manager);
            RequestContext.registerRepository(EmailContactRepository.name, repository);
            return repository;
        }
        return EmailContactRepository.repository;
    }
    constructor(target: EntityTarget<EmailContactEntity> = EmailContactEntity, manager?: EntityManager) {
        super(target, manager);
    }
    getAllByAddresses(addresses: string[]) {
        return this.find({
            where: {
                address: In(addresses),
            },
        });
    }
}
