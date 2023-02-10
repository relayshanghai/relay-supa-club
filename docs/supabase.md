Delete a user:

set the profiles table to cascade delete:

```sql
delete from profiles where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from usages where user_id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
delete from auth.users where id = '944be6e7-5ac1-4920-b23a-04faac1c610f';
```
