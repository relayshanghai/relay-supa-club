import {
    populateDB,
    signInTestUser,
    testSupabase,
    testUserEmail,
    testUserPassword,
} from '../../../../testUtils';

/* 
Testing the rules defined in ./profiles.sql
*/

const user2Email = 'bobsyouruncle@cheerio.goodday';
const user2Password = 'bobsyouruncle';

describe('profiles RLS', () => {
    test('view only own profile', async () => {
        await populateDB([
            { email: testUserEmail, password: testUserPassword },
            { email: user2Email, password: user2Password },
        ]);

        const { data, error: error3 } = await testSupabase.auth.signInWithPassword({
            email: testUserEmail,
            password: testUserPassword,
        });

        if (error3) {
            throw new Error(error3.message);
        }
        if (!data.user) {
            throw new Error('No user returned from signin');
        }
        const user1 = data.user;

        testSupabase.rpc('truncate_all_tables', {});

        console.log(user1);
        // can get own profile:
        const { data: profile, error: error1 } = await testSupabase
            .from('profiles')
            .select('*')
            .eq('id', user1.id)
            .single();

        expect(error1).toBeNull();
        expect(profile).toHaveLength(1);
        console.log(profile);

        // can't get other user's profile:
        const user2 = await signInTestUser({ email: user2Email, password: user2Password });
        const { data: profile2, error: error2 } = await testSupabase
            .from('profiles')
            .select('*')
            .eq('id', user1.id)
            .single();

        console.log(profile2, error2);
    }, 20000);
});
