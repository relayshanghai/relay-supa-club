# Database Helper Script

This script allows us to auto generate and modify policies in your _LOCAL_ supabase environment

### You can also view help via:

```bash
./supabase/db.sh --help
```

## Database Functions

### Creating a database function

```bash
./supabase/db.sh create_dbfn <function_name>
```

### Pushing database functions

```bash
./supabase/db.sh push_dbfn
```

### Listing database functions

```bash
./supabase/db.sh list_dbfn
```

### Dropping a policy

```bash
./supabase/db.sh drop_dbfn <function_name>
```

---

## Policies

### Creating a policy

```bash
./supabase/db.sh create_policy <policy_name> <table_name>
```

### Pushing policies

```bash
./supabase/db.sh push_policies
```

### Listing policies

```bash
./supabase/db.sh list_policies
```

### Dropping a policy

```bash
./supabase/db.sh drop_policy <policy_name>
```

---

## Other commands

### Get the current linked project

```bash
./supabase/db.sh get_proj
```

### Testing the database

```bash
./supabase/db.sh db_test

# or test a specific test
./supabase/db.sh db_test test1
```

### Connecting to the database

```bash
./supabase/db.sh connect
```

### Saving the database password

```bash
./supabase/db.sh save_password
```

### Generate local database types

```bash
./supabase/db.sh gen_db_types
```

### Using supabase cli commands

```bash
./supabase/db.sh supa <command> [param1] [param2...]

# or you can use them directly
./supabase/db.sh <supabase_command> [param1] [param2...]
```
