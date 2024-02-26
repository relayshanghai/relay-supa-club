import { vitest, expect, describe, it } from 'vitest';
import { ProfileEntity } from '../profile/profile-entity';
import BaseRepository from './base-repository';
import { DatabaseProvider } from './database-provider';
import { InjectInitializeDatabaseOnAllProps } from './inject-db-initialize';

describe(`src/infrastructure/database/provider/inject-db-initialize.ts`, () => {
    const initializeMock = vitest.fn();
    DatabaseProvider.initialize = initializeMock;
    describe(`@InjectInitializeDatabaseOnAllProps`, () => {
        it(`should initialize database on all props triggered`, async () => {
            @InjectInitializeDatabaseOnAllProps
            class ProfileRepository extends BaseRepository<ProfileEntity> {
                constructor() {
                    super(ProfileEntity);
                }
                async someMethod() {
                    // trigger something
                }
            }
            const userRepository = new ProfileRepository();
            await userRepository.someMethod();
            expect(initializeMock).toBeCalledTimes(1);
        });
    });
});
