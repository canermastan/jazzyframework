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
  # Define the "todos" table
  createTable("todos")
    .increments("id") # Primary key
    .string("title")
    .boolean("completed", default = false)
    .execute()

  # Define the "users" table
  createTable("users")
    .increments("id") # Primary key
    .string("username")
    .string("password")
    .execute()
```

## Running the Schema Initialization

Once you've defined your schema, you need to call it when your application starts, typically after you've established a database connection.

```nim
# src/app.nim
import jazzy
import ./schema

proc main() =
  # 1. Connect to the database
  connectDB("todo.db")

  # 2. Initialize the schema (Create tables if they don't exist)
  initSchema()

  # 3. Start the server
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

### Parameters

- **`name`**: The name of the column in the database.
- **`nullable`**: If `true`, the column can be empty (`NULL`). Defaults to `false`.
- **`default`**: The value used if you don't provide one when saving data. 
    - *Strings are automatically wrapped in quotes.*
    - *Booleans are converted to 1 or 0.*

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
  completed INTEGER NOT NULL DEFAULT 0
)
```
