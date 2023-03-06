import { populateDB, testSupabase, testUserEmail, testUserPassword } from '../../../../testUtils';

/* 
Testing the rules defined in api/db/RLS.sql
*/

describe('edit_own_company', () => {
    beforeAll(async () => {
        expect(testSupabase).toBeDefined();
        await populateDB();
        // login the user
        const { error: error1 } = await testSupabase.auth.signInWithPassword({
            email: testUserEmail,
            password: testUserPassword,
        });
        if (error1) {
            throw new Error(error1.message);
        }
    }, 20000);
    test('edit_own_company', async () => {
        // check that this account is able to access the company
        const { data: company, error: error2 } = await testSupabase
            .from('companies')
            .select('*')
            .eq('name', 'test company')
            .single();

        if (error2) {
            throw new Error(error2.message);
        }
        expect(company).toBeDefined();

        // check that a different account is not able to access the company
        const { error: error3 } = await testSupabase.auth.signUp({
            email: 'user2',
            password: 'password',
        });
        if (error3) {
            throw new Error(error3.message);
        }
        // sign out
        const { error: error4 } = await testSupabase.auth.signOut();
        if (error4) {
            throw new Error(error4.message);
        }
        const { data: company2, error: error5 } = await testSupabase
            .from('companies')
            .select('*')
            .eq('name', 'test company')
            .single();
        if (error5) {
            throw new Error(error5.message);
        }
        expect(company2).toBeUndefined();
    });
});
