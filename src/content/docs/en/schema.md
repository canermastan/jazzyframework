---
title: Schema
description: Creating and managing database tables in Jazzy.
---

# Schema

Jazzy provides a fluent interface for defining your database schema. This allows you to create tables and manage your database structure using pure Nim code.

## Defining Your Schema

A common pattern is to create a `schema.nim` file where you define your tables. You can use the `createTable` helper to define the structure of your database.

```nim
# src/schema.nim
import jazzy

proc initSchema*() =
  # Define the "todos" table with timestamps
  createTable("todos")
    .increments("id")
    .string("title")
    .boolean("completed", default = false)
    .timestamps() # Adds created_at and updated_at
    .execute()

  # Define the "users" table with soft deletes
  createTable("users")
    .increments("id")
    .string("username")
    .string("password")
    .softDeletes() # Adds deleted_at
    .execute()
```

## Running the Schema Initialization

Once you've defined your schema, you need to call it when your application starts, typically after you've established a database connection.

```nim
# src/app.nim
import jazzy
import ./schema

proc main() =
  connectDB("todo.db")
  initSchema()
  Jazzy.serve(8080)

main()
```

## Available Column Types

The `createTable` builder supports the following column types mapped directly to SQLite:

| Method | SQLite Type | Description |
| :--- | :--- | :--- |
| `.increments(name)` | `INTEGER` | Primary key with `AUTOINCREMENT`. |
| `.string(name, nullable, default)` | `TEXT` | Text column. |
| `.integer(name, nullable, default)` | `INTEGER` | Standard integer column. |
| `.boolean(name, nullable, default)` | `INTEGER` | Stored as `1` (true) or `0` (false). |
| `.timestamp(name, nullable, default)` | `DATETIME` | A custom date/time column. |
| `.timestamps()` | `DATETIME` | Adds `created_at` and `updated_at`. |
| `.softDeletes()` | `DATETIME` | Adds `deleted_at` for soft delete support. |

### Parameters

- **`name`**: The name of the column in the database.
- **`nullable`**: If `true`, the column can be empty (`NULL`). Defaults to `false`.
- **`default`**: The value used if you don't provide one when saving data. 
    - *Strings are automatically wrapped in quotes.*
    - *Booleans are converted to 1 or 0.*
    - *For timestamps, use `"CURRENT_TIMESTAMP"` for automatic server-side time.*

## Table Options & Actions

You can further refine your table structure and finalize the creation using these methods:

- **`.ifNotExists(val: bool)`**: Adds `IF NOT EXISTS` to the query (Default: `true`).
- **`.execute()`**: Generates and runs the SQL statement on the current connection.

### Example Output
When you call `.execute()`, Jazzy generates a standard SQL statement:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```
