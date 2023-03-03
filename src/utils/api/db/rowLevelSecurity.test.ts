import { testSupabase } from '../../testUtils';

/* 
Testing the rules defined in api/db/RLS.sql
*/

test('init', () => {
    expect(testSupabase).toBeDefined();
});
