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

The `createTable` builder currently supports the following column types, mapped to SQLite data types:

### `.increments(name)`
Creates an auto-incrementing integer primary key.
- **SQLite Type:** `INTEGER PRIMARY KEY AUTOINCREMENT`
- **Nullable:** No

### `.string(name, nullable = false, default = "")`
Creates a text column. 
- **SQLite Type:** `TEXT`
- **Note:** If a default value is provided, it is automatically wrapped in single quotes.

### `.integer(name, nullable = false, default = 0)`
Creates an integer column.
- **SQLite Type:** `INTEGER`

### `.boolean(name, nullable = false, default = false)`
Creates a boolean column (stored as an integer).
- **SQLite Type:** `INTEGER`
- **Default:** Automatically mapped to `1` (true) or `0` (false).

## Table Options

### `.ifNotExists(val: bool = true)`
Determines if the `IF NOT EXISTS` clause should be added to the SQL query. Jazzy enables this by default.

## Actions

### `.execute()`
Generates the SQL statement and executes it using the active database connection.

```sql
-- Example output of .execute()
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0
)
```
