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

### Counting Records
```nim
let totalUsers = DB.table("users").count()
let activeUsers = DB.table("users").where("active", 1).count()
```

### Pagination (Limit)
Limit the number of results returned.

```nim
# Get the top 10 recent posts
let posts = DB.table("posts").limit(10).get()
```

## Modifying Data

### Inserts
To insert data, pass a `JsonNode` (`%*`). Returns the **ID** of the newly inserted row.

```nim
let newUserId = DB.table("users").insert(%*{
  "username": "caner",
  "email": "jcanermastan@gmail.com",
  "created_at": "2023-10-27"
})
```

### Updates
Updates affect all rows matching the `where` clause.

```nim
# Deactivate user #5
DB.table("users")
  .where("id", 5)
  .update(%*{"active": 0})

# Mark all users as verified
DB.table("users").update(%*{"verified": 1}) 
```

### Deletes
Deletes all rows matching the `where` clause.

```nim
DB.table("users").where("id", 5).delete()
```

> **Warning:** Calling `delete()` without a `where` clause will wipe the table!

## Advanced

### Raw SQL
For complex queries (JOINs, Subqueries) that the query builder doesn't support, you can drop down to the underlying driver layer.

```nim
import jazzy/db/database
import tiny_sqlite

let conn = getConn()
for row in conn.iterate("SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id"):
  echo row[0].strVal, " wrote ", row[1].strVal
```
