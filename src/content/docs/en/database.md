---
title: Database
description: Powerful Query Builder and ORM-like features.
---

Jazzy includes a powerful, fluent Query Builder that allows you to interact with your database without writing raw SQL. It allows you to switch underlying databases with minimal code changes (currently optimized for SQLite).

## Connecting
In your `app.nim` or `database.nim` module:

```nim
import jazzy

connectDB("app.db")
```

## Retrieving Data

### Fetching All Rows
```nim
let users = DB.table("users").get()
# Returns a JsonNode (JArray) of objects
```

### Fetching a Single Row
```nim
let user = DB.table("users").where("id", 1).first()
# Returns a JsonNode (JObject) or JNull if not found
```

### Selecting Specific Columns
By default, `get()` returns all columns (`SELECT *`). You can specify which columns you want:

```nim
let user = DB.table("users").select("name", "email").first()
# Only "name" and "email" keys will exist in the result JsonNode
```

### Where Clauses
Fluid chaining makes complex queries easy.

```nim
DB.table("posts").where("published", 1)
```

**Comparison Operators:**
```nim
DB.table("users").where("age", ">=", 18)
DB.table("products").where("price", "<", 100)
DB.table("status", "!=", "deleted")
```

**Chaining (AND logic):**
Multiple calls are treated as `AND` conditions.
```nim
DB.table("users")
  .where("active", 1)
  .where("role", "admin")
  .get()
# SELECT * FROM users WHERE active = 1 AND role = 'admin'
```

### Ordering and Sorting
You can sort your results using `orderBy`.

```nim
# Sort users by age in descending order
let users = DB.table("users").orderBy("age", "DESC").get()

# Default direction is ASC (ascending)
let recentPosts = DB.table("posts").orderBy("created_at").get()
```

### Counting Records
```nim
let totalUsers = DB.table("users").count()
let activeUsers = DB.table("users").where("active", 1).count()
```

### Pagination (Limit & Offset)
Limit the number of results returned or skip a certain number of records.

```nim
# Get the top 10 recent posts
let posts = DB.table("posts").limit(10).get()

# Pagination: Skip 20 posts and get the next 10
let page3 = DB.table("posts").limit(10).offset(20).get()
```

## Modifying Data

### Inserts
To insert data, pass a `JsonNode` (`%*`). Returns the **ID** of the newly inserted row.

```nim
let newUserId = DB.table("users").insert(%*{
  "username": "caner",
  "email": "jcanermastan@gmail.com"
})
```

> **Note:** If your table has `created_at` or `updated_at` columns, Jazzy will automatically populate them with the current UTC timestamp.

### Updates
Updates affect all rows matching the `where` clause.

```nim
# Deactivate user #5
DB.table("users")
  .where("id", 5)
  .update(%*{"active": 0})
```

> **Note:** If your table has an `updated_at` column, Jazzy will automatically update its value.

### Deletes
Deletes all rows matching the `where` clause.

```nim
DB.table("users").where("id", 5).delete()
```

> **Warning:** Calling `delete()` without a `where` clause will wipe the table!

## Soft Deletes
When a table supports Soft Deletes, records are not actually removed from the database. Instead, a `deleted_at` timestamp is set.

### Supporting Soft Deletes
In your schema definition:
```nim
createTable("posts")
  .increments("id")
  .string("title")
  .softDeletes() # Adds deleted_at column
  .execute()
```

### Querying with Soft Deletes
By default, soft-deleted records are **excluded** from all queries.

```nim
# Only returns active (non-deleted) posts
let posts = DB.table("posts").get()

# Include deleted records
let allPosts = DB.table("posts").withTrashed().get()

# Only retrieve deleted records
let trash = DB.table("posts").onlyTrashed().get()
```

### Restoring & Forcing
```nim
# Restore a deleted record
DB.table("posts").where("id", 1).restore()

# Permanently delete a record
DB.table("posts").where("id", 1).forceDelete()
```

## Raw SQL

For complex queries (JOINs, subqueries) that the Query Builder doesn't yet support, you can use the `raw()` and `rawExec()` methods.

### Fetching Data (`raw`)

The raw() method is used for data-returning queries (like `SELECT` or `PRAGMA`). It returns a JSON array of rows.

```nim
let res = DB.raw("SELECT name, age FROM users WHERE id = ?", 1)
```

### Executing Statements (`rawExec`)

The `rawExec()` method is used for statements that modify data (`INSERT`, `UPDATE`, `DELETE`). It returns the number of affected rows.

```nim
let affected = DB.rawExec("UPDATE users SET age = ? WHERE name = ?", 30, "Alice")
```
