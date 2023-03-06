import {
    populateDB,
    testCompanyName,
    testSupabase,
    testUserEmail,
    testUserPassword,
} from './testUtils';
test('can initiate test supabase client', () => {
    expect(testSupabase).toBeDefined();
});
test('populateDB', async () => {
    await populateDB();
    // login the user
    const { error: error2 } = await testSupabase.auth.signInWithPassword({
        email: testUserEmail,
        password: testUserPassword,
    });

    if (error2) {
        throw new Error(error2.message);
    }
    // check that profile and company exist

    // console.log({ profile });
    const { data: company, error: error4 } = await testSupabase
        .from('companies')
        .select('*')
        .eq('name', testCompanyName)
        .single();
    if (error4) {
        throw new Error(error4.message);
    }
    expect(company).toBeDefined();
    expect(company?.name).toBe(testCompanyName);

    const { data: profile, error: error3 } = await testSupabase
        .from('profiles')
        .select('*')
        .eq('email', testUserEmail)
        .single();
    if (error3) {
        throw new Error(error3.message);
    }
    expect(profile).toBeDefined();
    expect(profile?.company_id).toEqual(company?.id);
}, 20000); // the test times out after 20 seconds. Because we are using a live remote supabase database, we need to wait for the database to respond. This should be enough time.
