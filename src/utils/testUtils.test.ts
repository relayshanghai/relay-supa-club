import { testSupabase } from './testUtils';
test('can initiate test supabase client', () => {
    expect(testSupabase).toBeDefined();
});
