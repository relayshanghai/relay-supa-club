import { RequestContext } from 'src/utils/request-context/request-context';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { AddressEntity } from './address-entity';
import type { EntityManager, EntityTarget } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export class AddressRepository extends BaseRepository<AddressEntity> {
    static repository: AddressRepository = new AddressRepository();
    static getRepository(): AddressRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<AddressRepository>(AddressRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new AddressRepository(AddressEntity, manager);
            RequestContext.registerRepository(AddressRepository.name, repository);
            return repository;
        }
        return AddressRepository.repository;
    }
    constructor(target: EntityTarget<AddressEntity> = AddressEntity, manager?: EntityManager) {
        super(target, manager);
    }
}
