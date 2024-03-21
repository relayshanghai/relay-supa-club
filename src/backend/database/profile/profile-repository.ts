import awaitToError from 'src/utils/await-to-error';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ProfileEntity } from './profile-entity';
import type { EntityManager, EntityTarget, TypeORMError } from 'typeorm';
import { RequestContext } from 'src/utils/request-context/request-context';

@InjectInitializeDatabaseOnAllProps
export class ProfileRepository extends BaseRepository<ProfileEntity> {
    static repository: ProfileRepository = new ProfileRepository();
    static getRepository(): ProfileRepository {
        // when request context is not available, use the default repository, otherwise use the manager from the request context
        // to cover transactional operations
        const manager = RequestContext.getManager();
        if (manager) {
            const contextRepository = RequestContext.getRepository<ProfileRepository>(ProfileRepository.name);
            if (contextRepository) {
                return contextRepository;
            }
            const repository = new ProfileRepository(ProfileEntity, manager);
            RequestContext.registerRepository(ProfileRepository.name, repository);
            return repository;
        }
        return ProfileRepository.repository;
    }
    constructor(target: EntityTarget<ProfileEntity> = ProfileEntity, manager?: EntityManager) {
        super(target, manager);
    }
    async phoneNumberExists(phoneNumber: string) {
        const [err] = await awaitToError<TypeORMError>(
            this.findOneByOrFail({
                phone: phoneNumber,
            }),
        );
        if (err) {
            return false;
        }
        return true;
    }
    async emailExists(email: string) {
        const [err] = await awaitToError<TypeORMError>(
            this.findOneByOrFail({
                email,
            }),
        );
        if (err) {
            return false;
        }
        return true;
    }
}
