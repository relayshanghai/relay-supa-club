import awaitToError from 'src/utils/await-to-error';
import BaseRepository from '../provider/base-repository';
import { InjectInitializeDatabaseOnAllProps } from '../provider/inject-db-initialize';
import { ProfileEntity } from './profile-entity';
import type { TypeORMError } from 'typeorm';

@InjectInitializeDatabaseOnAllProps
export class ProfileRepository extends BaseRepository<ProfileEntity> {
    static repository: ProfileRepository = new ProfileRepository();
    static getRepository(): ProfileRepository {
        return ProfileRepository.repository;
    }
    constructor() {
        super(ProfileEntity);
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
