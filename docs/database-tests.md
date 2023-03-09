## run tests

Enable `pgtap` in the supabase dashboard by going to database > extensions and clicking the `enable` button next to `pgtap`

Make sure you have docker running

Make sure you have the local supabase environment set up

Start the local supabase instance

```bash
npx supabase start
```

now you can run tests with

```bash
npx supabase test db
```

https://usebasejump.com/blog/testing-on-supabase-with-pgtap
https://github.com/usebasejump/supabase-test-helpers
https://pgtap.org/documentation.html#imokyourenotok
https://medium.com/engineering-on-the-incline/unit-testing-postgres-with-pgtap-af09ec42795
https://github.com/supabase/supabase/discussions/11948
https://discord.com/channels/839993398554656828/1074402267626745946

how should we handle superusers?

Is there a way we can have the supabase database update rules/functions/ triggers based on pushes to github?

Can we co-locate the tests? or do we have tot use the provided folder?
